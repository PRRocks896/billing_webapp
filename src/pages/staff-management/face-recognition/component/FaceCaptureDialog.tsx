import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Typography
} from '@mui/material';
import { CloseCircle, TickCircle, Warning2 } from 'iconsax-reactjs';
import moment from 'moment';
import { detectDescriptor, detectEyes, EyeBox, loadModels } from 'utils/faceApi';
import { registerFace, verifyFace } from 'service/face';
import { BlinkOptions, createBlinkDetector } from './blinkDetector';
import { createEyeSampler } from './eyeSampler';

// ─── Types ───────────────────────────────────────────────────────────────────
export type FaceMode = 'register' | 'attendance';

export interface FaceStaff {
  id: number;
  name: string;
  nickName?: string;
  userID?: number;
  faceRegisteredAt?: string | null;
}

interface FaceCaptureDialogProps {
  open: boolean;
  mode: FaceMode;
  staff: FaceStaff | null;
  location: { latitude: number; longitude: number } | null;
  onClose: () => void;
  /** Called after a registration / attendance was saved so the list can refresh */
  onDone: () => void;
}

type Phase =
  | 'init' // loading models + starting camera
  | 'checklist' // register only: eyewear confirmation
  | 'liveness' // waiting for a blink
  | 'capturing' // sampling descriptors
  | 'review' // register only: preview before saving
  | 'saving' // register request in flight
  | 'verifying' // verify request in flight
  | 'success'
  | 'rejected' // face matched but attendance was refused (cooldown / daily limit)
  | 'failed'
  | 'error'; // models / camera could not start

const LIVENESS_TIMEOUT_MS = 20000;
const REGISTER_SAMPLES = 3; // descriptors averaged for a stable enrolment
const MAX_SAMPLE_SPREAD = 0.45; // samples further apart than this are not the same steady face
const AUTO_CLOSE_MS = 2200;
// Pixel-contrast values (luminance std-dev, 0-255 scale) sampled at the display frame rate
const PIXEL_BLINK: BlinkOptions = { window: 45, minSamples: 15, minOpen: 3, minDrop: 3 };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const distance = (a: number[], b: number[]) => Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));

const averageDescriptors = (list: number[][]) => list[0].map((_, i) => list.reduce((sum, d) => sum + d[i], 0) / list.length);

const errorText = (err: any, fallback: string) => err?.data?.reason || err?.message || err?.messageCode || fallback;

// ─── Dialog shell ─────────────────────────────────────────────────────────────
// The body is only mounted while open so every opening starts from a clean state
// and the camera is always released on close.
const FaceCaptureDialog: React.FC<FaceCaptureDialogProps> = (props) => {
  const { open, mode, staff, onClose } = props;
  const [busy, setBusy] = useState(false);

  const handleClose = () => {
    if (!busy) onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {mode === 'register' ? 'Register Face' : 'Face Attendance'}
        {staff && (
          <Typography variant="body2" color="text.secondary" fontWeight={400}>
            {staff.name}
            {staff.nickName ? ` (${staff.nickName})` : ''}
          </Typography>
        )}
      </DialogTitle>
      {open && staff && <FaceCaptureBody {...props} staff={staff} onBusyChange={setBusy} />}
    </Dialog>
  );
};

// ─── Dialog body ──────────────────────────────────────────────────────────────
const FaceCaptureBody: React.FC<FaceCaptureDialogProps & { staff: FaceStaff; onBusyChange: (busy: boolean) => void }> = ({
  mode,
  staff,
  location,
  onClose,
  onDone,
  onBusyChange
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const runIdRef = useRef(0); // bumping this aborts any scan loop in flight
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const descriptorRef = useRef<number[] | null>(null);
  const locationRef = useRef(location);
  locationRef.current = location;
  // Always call the parent's latest callbacks, even from a scan started earlier
  const onCloseRef = useRef(onClose);
  const onDoneRef = useRef(onDone);
  onCloseRef.current = onClose;
  onDoneRef.current = onDone;

  const [phase, setPhase] = useState<Phase>('init');
  const [hint, setHint] = useState('');
  const [message, setMessage] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [noSunglasses, setNoSunglasses] = useState(false);
  const [noSpecs, setNoSpecs] = useState(false);
  const [result, setResult] = useState<{ action?: string; timestamp?: string } | null>(null);
  const [initKey, setInitKey] = useState(0); // bump to retry models + camera

  const isRegister = mode === 'register';
  const alreadyRegistered = !!staff.faceRegisteredAt;

  useEffect(() => {
    onBusyChange(phase === 'saving' || phase === 'verifying');
  }, [phase, onBusyChange]);

  // ── Camera ──────────────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async (isCancelled: () => boolean) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera is not available. Open this page over HTTPS (or localhost).');
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      if (isCancelled()) {
        // closed / re-initialised while the permission prompt was open
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
    } catch (err: any) {
      throw new Error(
        err?.name === 'NotAllowedError'
          ? 'Camera access was denied. Please allow camera permission in your browser.'
          : err?.name === 'NotFoundError'
            ? 'No camera was found on this device.'
            : `Camera error: ${err?.message || 'could not start the camera'}`
      );
    }
  }, []);

  // ── Scan pipeline ───────────────────────────────────────────────────────────
  /**
   * Wait for one blink. Resolves 'ok' | 'timeout' | 'aborted'.
   *
   * Two loops run together: face detection (slow, a few times a second) only keeps the
   * eye boxes up to date, while a requestAnimationFrame loop samples the pixels inside
   * those boxes at the display rate, so a 100-200ms blink is not missed.
   */
  const waitForBlink = useCallback(async (alive: () => boolean) => {
    const pixelBlink = createBlinkDetector(PIXEL_BLINK);
    const earBlink = createBlinkDetector(); // secondary signal, rarely moves with this landmark model
    const sampleEyes = createEyeSampler();
    const startedAt = Date.now();
    let boxes: EyeBox[] = [];
    let blinked = false;
    let rafId = 0;
    let lastHintAt = 0;

    const showHint = () => {
      const openness = Math.round(Math.min(Math.max(pixelBlink.level(), 0), 1.2) * 100);
      const slow = Date.now() - startedAt > 8000;
      setHint(
        `${slow ? 'Blink slowly, a little firmly, while looking at the camera' : 'Face detected — blink once to confirm you are live'} (eye openness ${openness}%)`
      );
    };

    const tick = () => {
      if (!alive() || blinked) return;
      const video = videoRef.current;
      if (video && boxes.length) {
        const value = sampleEyes(video, boxes);
        if (value !== null && pixelBlink.push(value)) blinked = true;
        const now = Date.now();
        if (now - lastHintAt > 100) {
          lastHintAt = now;
          showHint();
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    try {
      while (alive() && !blinked && Date.now() - startedAt <= LIVENESS_TIMEOUT_MS) {
        try {
          const { ear, boxes: found } = await detectEyes(videoRef.current!, { minConfidence: 0.55 });
          if (!alive()) break;
          if (ear === null) {
            boxes = [];
            pixelBlink.reset();
            earBlink.reset();
            setHint('No face detected — please look straight at the camera');
          } else {
            boxes = found;
            if (earBlink.push(ear)) blinked = true;
          }
        } catch {
          /* transient detection error, keep going */
        }
        await sleep(30);
      }
    } finally {
      cancelAnimationFrame(rafId);
    }
    if (blinked) return 'ok';
    return alive() ? 'timeout' : 'aborted';
  }, []);

  /** Sample `count` descriptors from the live video and average them. */
  const sampleFace = useCallback(async (count: number, alive: () => boolean) => {
    const samples: number[][] = [];
    let lastError = '';
    for (let attempt = 0; attempt < count * 3 && samples.length < count; attempt++) {
      if (!alive()) return { status: 'aborted' as const };
      const { descriptor, error } = await detectDescriptor(videoRef.current!, { minConfidence: 0.6 });
      if (!alive()) return { status: 'aborted' as const };
      if (descriptor) samples.push(descriptor);
      else lastError = error || lastError;
      if (samples.length < count) await sleep(200);
    }
    if (samples.length < count) {
      return { status: 'error' as const, error: lastError || 'Could not read your face clearly. Please try again.' };
    }
    for (let i = 0; i < samples.length; i++) {
      for (let j = i + 1; j < samples.length; j++) {
        if (distance(samples[i], samples[j]) > MAX_SAMPLE_SPREAD) {
          return { status: 'error' as const, error: 'Face moved too much while scanning. Hold still and try again.' };
        }
      }
    }
    return { status: 'ok' as const, descriptor: averageDescriptors(samples) };
  }, []);

  const takeSnapshot = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!video || !canvas || !ctx) return null;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.7);
  }, []);

  const finish = useCallback(
    (next: Phase, text = '') => {
      setPhase(next);
      setMessage(text);
    },
    []
  );

  const scheduleClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => onCloseRef.current(), AUTO_CLOSE_MS);
  }, []);

  const startScan = useCallback(async () => {
    const runId = ++runIdRef.current;
    const alive = () => runIdRef.current === runId;

    descriptorRef.current = null;
    setPreviewSrc(null);
    setMessage('');
    setResult(null);
    setPhase('liveness');
    setHint('Look at the camera and blink once');

    const live = await waitForBlink(alive);
    if (!alive()) return;
    if (live === 'timeout') {
      return finish('failed', 'Liveness check failed — no blink detected. Please try again.');
    }

    setPhase('capturing');
    setHint('Hold still…');
    let sample: Awaited<ReturnType<typeof sampleFace>>;
    try {
      sample = await sampleFace(isRegister ? REGISTER_SAMPLES : 1, alive);
    } catch (err: any) {
      // never leave the dialog stuck on "Hold still…"
      if (alive()) finish('failed', 'Could not read your face. Please try again.');
      return;
    }
    if (!alive() || sample.status === 'aborted') return;
    if (sample.status === 'error') {
      return finish('failed', sample.error);
    }

    if (isRegister) {
      descriptorRef.current = sample.descriptor;
      setPreviewSrc(takeSnapshot());
      return finish('review');
    }

    // Attendance: verify against this staff member only
    setPhase('verifying');
    const now = moment();
    try {
      const res: any = await verifyFace({
        descriptor: sample.descriptor,
        staffId: staff.id,
        userID: staff.userID,
        latitude: `${locationRef.current?.latitude ?? 0}`,
        longitude: `${locationRef.current?.longitude ?? 0}`,
        date: now.format('DD-MM-YYYY'),
        time: now.format('HH:mm:ss')
      });
      const data = res?.data;
      if (res?.success && data?.matched) {
        setResult({ action: data.action, timestamp: data.timestamp });
        finish('success');
        onDoneRef.current();
        scheduleClose();
      } else {
        finish('failed', data?.reason || res?.message || 'Face not recognised');
      }
    } catch (err: any) {
      // Face matched but the server refused the punch (cooldown, daily limit, ...)
      if (err?.data?.matched) finish('rejected', errorText(err, 'Attendance could not be recorded'));
      else finish('failed', errorText(err, 'Verification failed. Please try again.'));
    }
  }, [finish, isRegister, sampleFace, scheduleClose, staff.id, staff.userID, takeSnapshot, waitForBlink]);

  const saveRegistration = useCallback(async () => {
    if (!descriptorRef.current || phase !== 'review') return;
    setPhase('saving');
    try {
      const res: any = await registerFace({ staffId: staff.id, descriptor: descriptorRef.current });
      if (!res?.success) throw res;
      descriptorRef.current = null;
      finish('success');
      onDoneRef.current();
      scheduleClose();
    } catch (err: any) {
      // e.g. "This face is already registered for another staff member"
      finish('failed', errorText(err, 'Registration failed. Please try again.'));
    }
  }, [finish, phase, scheduleClose, staff.id]);

  // ── Models + camera lifecycle ───────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setPhase('init');
    setMessage('');

    (async () => {
      try {
        await loadModels();
        if (cancelled) return;
        await startCamera(() => cancelled);
        if (cancelled) return;
        if (isRegister) setPhase('checklist');
        else startScan();
      } catch (err: any) {
        if (cancelled) return;
        stopCamera();
        finish('error', err?.message || 'Failed to start face recognition');
      }
    })();

    return () => {
      cancelled = true;
      runIdRef.current++;
      stopCamera();
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
    // startScan is intentionally not a dependency: it must run once per (re)initialisation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initKey]);

  // ── UI ──────────────────────────────────────────────────────────────────────
  const scanning = phase === 'liveness' || phase === 'capturing';
  const working = phase === 'saving' || phase === 'verifying';
  const showGuide = phase === 'liveness' || phase === 'capturing' || phase === 'checklist';
  const frameColor =
    phase === 'success' ? 'success.main' : phase === 'failed' || phase === 'error' ? 'error.main' : phase === 'rejected' ? 'warning.main' : 'divider';

  return (
    <>
      <DialogContent>
        {isRegister && alreadyRegistered && phase === 'checklist' && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            A face is already registered for this staff member. Registering again will replace it.
          </Alert>
        )}

        <Box
          sx={{
            position: 'relative',
            // Cap the height to the viewport so the checklist, hints and buttons below stay visible
            width: 'min(100%, calc(50vh * 4 / 3))',
            mx: 'auto',
            aspectRatio: '4/3',
            bgcolor: '#0a0a0a',
            borderRadius: 2,
            overflow: 'hidden',
            border: '3px solid',
            borderColor: frameColor,
            transition: 'border-color 0.3s'
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scaleX(-1)' }}
          />
          {previewSrc && (
            <Box
              component="img"
              src={previewSrc}
              alt="Captured face"
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {showGuide && (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <Box
                sx={{
                  width: '42%',
                  aspectRatio: '5/6',
                  border: '2px dashed rgba(255,255,255,0.6)',
                  borderRadius: '50%',
                  boxShadow: '0 0 0 4000px rgba(0,0,0,0.25)'
                }}
              />
            </Box>
          )}

          {(phase === 'init' || working) && (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1.5}
              sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}
            >
              <CircularProgress color="inherit" />
              <Typography fontWeight={600}>
                {phase === 'init' ? 'Loading face models & camera…' : phase === 'saving' ? 'Registering face…' : 'Verifying identity…'}
              </Typography>
            </Stack>
          )}

          {(phase === 'success' || phase === 'failed' || phase === 'rejected') && (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.7)', color: 'white', p: 2, textAlign: 'center' }}
            >
              {phase === 'success' ? (
                <TickCircle size={56} color="#4caf50" variant="Bold" />
              ) : phase === 'rejected' ? (
                <Warning2 size={56} color="#ff9800" variant="Bold" />
              ) : (
                <CloseCircle size={56} color="#f44336" variant="Bold" />
              )}
              <Typography variant="h5" fontWeight={800}>
                {phase === 'success'
                  ? isRegister
                    ? 'Face Registered'
                    : result?.action === 'clock-in'
                      ? 'Clocked In'
                      : 'Clocked Out'
                  : phase === 'rejected'
                    ? 'Face Verified'
                    : isRegister
                      ? 'Could Not Register'
                      : 'Not Recognised'}
              </Typography>
              {phase === 'success' && (
                <Typography>{isRegister ? staff.name : `${staff.name} • ${result?.timestamp || moment().format('DD-MM-YYYY HH:mm:ss')}`}</Typography>
              )}
              {message && <Typography variant="body2">{message}</Typography>}
            </Stack>
          )}
        </Box>

        {phase === 'checklist' && (
          <Stack mt={2}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Your eyes must be fully visible. Please confirm before starting:
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={noSunglasses} onChange={(e) => setNoSunglasses(e.target.checked)} />}
              label={<Typography variant="body2">I have removed my sunglasses</Typography>}
            />
            <FormControlLabel
              control={<Checkbox checked={noSpecs} onChange={(e) => setNoSpecs(e.target.checked)} />}
              label={<Typography variant="body2">I have removed my glasses / spectacles</Typography>}
            />
          </Stack>
        )}

        {scanning && (
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            {hint}
          </Alert>
        )}
        {phase === 'review' && (
          <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
            Face captured. Check the photo, then register — or retake.
          </Alert>
        )}
        {phase === 'error' && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {message}
          </Alert>
        )}
        {!isRegister && phase === 'liveness' && (
          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            Please remove sunglasses and glasses for accurate recognition.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        {phase === 'checklist' && (
          <>
            <Button variant="outlined" onClick={() => onCloseRef.current()} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" disabled={!(noSunglasses && noSpecs)} onClick={startScan} sx={{ borderRadius: 2, fontWeight: 700 }}>
              Start Capture
            </Button>
          </>
        )}
        {scanning && (
          <Button variant="outlined" onClick={() => onCloseRef.current()} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
        )}
        {phase === 'review' && (
          <>
            <Button variant="outlined" onClick={startScan} sx={{ borderRadius: 2 }}>
              Retake
            </Button>
            <Button variant="contained" color="success" onClick={saveRegistration} sx={{ borderRadius: 2, fontWeight: 700 }}>
              Register Face
            </Button>
          </>
        )}
        {(phase === 'failed' || phase === 'rejected') && (
          <>
            <Button variant="outlined" onClick={() => onCloseRef.current()} sx={{ borderRadius: 2 }}>
              Close
            </Button>
            {phase === 'failed' && (
              <Button variant="contained" onClick={startScan} sx={{ borderRadius: 2, fontWeight: 700 }}>
                Try Again
              </Button>
            )}
          </>
        )}
        {phase === 'success' && (
          <Button variant="contained" onClick={() => onCloseRef.current()} sx={{ borderRadius: 2, fontWeight: 700 }}>
            Done
          </Button>
        )}
        {phase === 'error' && (
          <>
            <Button variant="outlined" onClick={() => onCloseRef.current()} sx={{ borderRadius: 2 }}>
              Close
            </Button>
            <Button variant="contained" onClick={() => setInitKey((k) => k + 1)} sx={{ borderRadius: 2, fontWeight: 700 }}>
              Retry
            </Button>
          </>
        )}
        {(phase === 'init' || working) && (
          <Button variant="outlined" disabled sx={{ borderRadius: 2 }}>
            Please wait…
          </Button>
        )}
      </DialogActions>
    </>
  );
};

export default FaceCaptureDialog;
