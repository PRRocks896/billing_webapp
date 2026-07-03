import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {
  Camera,
  TickCircle,
  DocumentUpload,
  Scanner,
  Refresh,
  ScanBarcode,
  Warning2
} from 'iconsax-reactjs';
import { useSnackbar } from 'notistack';
import { loadModels, detectDescriptor, detectEAR } from 'utils/faceApi';
import { findStaff, getStaff, getStaffList } from 'service/staff';
import { registerFace } from 'service/face';
import useAuth from 'hooks/useAuth';

// ─── Types ───────────────────────────────────────────────────────────────────
interface StaffOption {
  id: number;
  label: string;
  name: string;
  nickName: string;
  staffPhoto?: string;
}

type UIState = 'idle' | 'loading-models' | 'ready' | 'liveness-check' | 'capturing' | 'uploading' | 'success' | 'error';

// ─── Component ────────────────────────────────────────────────────────────────
const FaceRegister: React.FC = () => {
  const { user, startLoading, stopLoading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [uiState, setUiState] = useState<UIState>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [modelProgress, setModelProgress] = useState(0);
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffOption | null>(null);
  const [capturedDescriptor, setCapturedDescriptor] = useState<number[] | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  // Eyewear instruction gate — user must acknowledge before capture
  const [eyewearConfirmed, setEyewearConfirmed] = useState(false);
  const [showEyewearGate, setShowEyewearGate] = useState(false);

  // ── Load staff list ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        startLoading();
        const res: any = await findStaff({ isActive: true });
        const list = res?.data || [];
        setStaffOptions(
          list.map((s: any) => ({
            id: s.id,
            label: `${s.name} (${s.nickName || s.phoneNumber})`,
            name: s.name,
            nickName: s.nickName,
            staffPhoto: s.staffPhoto
          }))
        );
      } catch {
        enqueueSnackbar('Failed to load staff list', { variant: 'error' });
      } finally {
        stopLoading();
      }
    };
    fetchStaff();
  }, [user]);

  // ── Start camera ─────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera access was denied. Please allow camera permission in your browser.'
          : `Camera error: ${err.message}`
      );
    }
  }, []);

  // ── Stop camera ──────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // ── Initialise models + camera ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      setUiState('loading-models');
      setStatusMessage('Loading face detection models…');
      setModelProgress(20);
      try {
        await loadModels();
        if (cancelled) return;
        setModelProgress(100);
        setUiState('ready');
        setStatusMessage('');
        await startCamera();
      } catch {
        if (cancelled) return;
        setUiState('error');
        setStatusMessage('Failed to load face detection models. Please refresh the page.');
      }
    };
    init();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // ── Capture & extract descriptor ─────────────────────────────────────────
  const livenessReqRef = useRef<number | null>(null);
  const isLivenessActiveRef = useRef(false);

  // Stop liveness check if component unmounts or resets
  const stopLivenessCheck = useCallback(() => {
    isLivenessActiveRef.current = false;
    if (livenessReqRef.current) {
      cancelAnimationFrame(livenessReqRef.current);
      livenessReqRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopLivenessCheck();
  }, [stopLivenessCheck]);

  const startLivenessCheck = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    setUiState('liveness-check');
    setStatusMessage('Please look at the camera and blink your eyes...');
    isLivenessActiveRef.current = true;

    let isBlinking = false;
    let blinkCount = 0;
    const EAR_THRESHOLD = 0.32;

    const checkLiveness = async () => {
      if (!isLivenessActiveRef.current || !videoRef.current) return;

      try {
        const { ear } = await detectEAR(videoRef.current);

        if (ear !== null) {
          if (ear < EAR_THRESHOLD) {
            isBlinking = true;
          } else if (isBlinking && ear >= EAR_THRESHOLD) {
            blinkCount++;
            isBlinking = false;
          }
        }

        if (blinkCount > 0) {
          stopLivenessCheck();
          proceedToCapture();
        } else {
          if (isLivenessActiveRef.current) {
            livenessReqRef.current = requestAnimationFrame(checkLiveness);
          }
        }
      } catch (err) {
        // Ignore transient errors and continue
        if (isLivenessActiveRef.current) {
          livenessReqRef.current = requestAnimationFrame(checkLiveness);
        }
      }
    };

    // Start loop
    checkLiveness();
  }, [stopLivenessCheck]);

  const proceedToCapture = async () => {
    setUiState('capturing');
    setStatusMessage('Analysing face…');

    try {
      const { descriptor, error } = await detectDescriptor(videoRef.current!);

      if (!descriptor) {
        enqueueSnackbar(error || 'No face detected', { variant: 'warning' });
        setUiState('ready');
        setStatusMessage('');
        return;
      }

      // Snapshot preview
      const ctx = canvasRef.current!.getContext('2d');
      if (ctx && videoRef.current) {
        canvasRef.current!.width = videoRef.current.videoWidth;
        canvasRef.current!.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        setPreviewSrc(canvasRef.current!.toDataURL('image/jpeg', 0.7));
      }

      setCapturedDescriptor(descriptor);
      setUiState('ready');
      setStatusMessage('✓ Face captured! Click "Register Face" to save.');
      enqueueSnackbar('Face captured successfully! Review and click Register.', { variant: 'success' });
    } catch (err: any) {
      setUiState('error');
      setStatusMessage(err.message || 'Face capture failed');
    }
  };

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    if (!selectedStaff) {
      enqueueSnackbar('Please select a staff member first', { variant: 'warning' });
      return;
    }

    // Show eyewear instruction gate first if not yet confirmed
    if (!eyewearConfirmed) {
      setShowEyewearGate(true);
      return;
    }

    // Proceed to liveness check
    startLivenessCheck();
  }, [selectedStaff, eyewearConfirmed, enqueueSnackbar, startLivenessCheck]);

  const handleEyewearConfirmed = useCallback(() => {
    setShowEyewearGate(false);
    setEyewearConfirmed(true);
    startLivenessCheck();
  }, [startLivenessCheck]);

  // ── Register ─────────────────────────────────────────────────────────────
  const handleRegister = useCallback(async () => {
    if (!capturedDescriptor || !selectedStaff) return;

    setUiState('uploading');
    setStatusMessage('Registering face biometric…');

    try {
      const res: any = await registerFace({
        staffId: selectedStaff.id,
        descriptor: capturedDescriptor
      });

      if (res?.success) {
        setUiState('success');
        setStatusMessage(`Face registered for ${selectedStaff.name}`);
        enqueueSnackbar(`✅ Face registered for ${selectedStaff.name}`, { variant: 'success' });
        setCapturedDescriptor(null);
        setPreviewSrc(null);
        setSelectedStaff(null);
      } else {
        throw new Error(res?.data?.message || 'Registration failed');
      }
    } catch (err: any) {
      setUiState('error');
      setStatusMessage(err.message || 'Registration failed');
      enqueueSnackbar(err.message || 'Registration failed', { variant: 'error' });
    }
  }, [capturedDescriptor, selectedStaff, enqueueSnackbar]);

  // ── Reset ────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    stopLivenessCheck();
    setCapturedDescriptor(null);
    setPreviewSrc(null);
    setSelectedStaff(null);
    setUiState('ready');
    setStatusMessage('');
  }, [stopLivenessCheck]);

  const isLoading = uiState === 'loading-models' || uiState === 'liveness-check' || uiState === 'capturing' || uiState === 'uploading';

  // Helper render for Staff Selector to keep it DRY across responsive layouts
  const renderStaffSelector = () => (
    <Card sx={{ borderRadius: 3, p: 2.5 }}>
      <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Camera size={20} />
        Select Staff Member
      </Typography>
      <Autocomplete
        options={staffOptions}
        value={selectedStaff}
        onChange={(_, v) => setSelectedStaff(v)}
        getOptionLabel={(o) => o.label}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search staff…"
            placeholder="Type name or ID"
            variant="outlined"
            size="small"
            fullWidth
          />
        )}
        noOptionsText="No staff found"
      />
      {selectedStaff && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'primary.lighter',
            border: '1px solid',
            borderColor: 'primary.light'
          }}
        >
          <Typography variant="body2" fontWeight={600} color="primary.dark">
            {selectedStaff.name}
          </Typography>
          <Typography variant="caption" color="primary.main">
            {selectedStaff.nickName}
          </Typography>
        </Box>
      )}
    </Card>
  );

  return (
    <>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
        {/* ─── Header ───────────────────────────────────────────────────────── */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          mb={3}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              <Scanner size={28} color="#fff" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Face Registration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Register staff biometric data for face recognition attendance
              </Typography>
            </Box>
          </Stack>
          {uiState === 'success' && (
            <Chip
              label="Registration Successful"
              color="success"
              icon={<TickCircle size={16} />}
              sx={{
                ml: { xs: 0, sm: 'auto' },
                mt: { xs: 1, sm: 0 },
                width: { xs: '100%', sm: 'auto' },
                justifyContent: 'center'
              }}
            />
          )}
        </Stack>

        {/* ─── Model Loading ────────────────────────────────────────────────── */}
        {uiState === 'loading-models' && (
          <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'primary.light' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  🤖 Initialising AI Models
                </Typography>
                <LinearProgress variant="indeterminate" />
                <Typography variant="caption" color="text.secondary">
                  Loading face detection models from local server… (first load may take 10-15 seconds)
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Mobile: Staff Selector at the top (hidden on desktop) */}
          <Grid size={{ xs: 12 }} sx={{ display: { xs: 'block', md: 'none' } }}>
            {renderStaffSelector()}
          </Grid>

          {/* ─── Left: Camera ──────────────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '2px solid',
                borderColor: capturedDescriptor ? 'success.main' : 'divider',
                transition: 'border-color 0.3s',
                boxShadow: capturedDescriptor ? '0 0 0 4px rgba(76, 175, 80, 0.1)' : 'none'
              }}
            >
              {/* Camera Error */}
              {cameraError && (
                <Alert severity="error" icon={<Warning2 size={20} />} sx={{ borderRadius: 0 }}>
                  {cameraError}
                </Alert>
              )}

              {/* Video Feed */}
              <Box
                sx={{
                  position: 'relative',
                  bgcolor: '#0a0a0a',
                  width: '100%',
                  aspectRatio: { xs: '3/4', sm: '4/3' },
                  overflow: 'hidden'
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transform: 'scaleX(-1)',
                    opacity: previewSrc ? 0 : 1,
                    transition: 'opacity 0.3s'
                  }}
                />
                {/* Snapshot preview overlay */}
                {previewSrc && (
                  <Box
                    component="img"
                    src={previewSrc}
                    alt="Captured face"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scaleX(-1)'
                    }}
                  />
                )}
                {/* Scanning overlay */}
                {uiState === 'capturing' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white'
                    }}
                  >
                    <CircularProgress color="inherit" size={60} thickness={3} sx={{ mb: 2 }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Analysing Face…
                    </Typography>
                  </Box>
                )}
                {/* Liveness overlay */}
                {uiState === 'liveness-check' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.4)',
                      color: 'white'
                    }}
                  >
                    <CircularProgress color="primary" size={60} thickness={3} sx={{ mb: 2 }} />
                    <Typography variant="h6" fontWeight={700}>
                      Liveness Check
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={500}>
                      Please blink your eyes
                    </Typography>
                  </Box>
                )}
                {/* Face Guide Overlay */}
                {(uiState === 'ready' || uiState === 'idle') && !previewSrc && !cameraError && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none'
                    }}
                  >
                    <Box
                      sx={{
                        width: 200,
                        height: 240,
                        border: '2px dashed rgba(255,255,255,0.4)',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 4000px rgba(0,0,0,0.15)'
                      }}
                    />
                  </Box>
                )}
                {/* Success badge */}
                {capturedDescriptor && previewSrc && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'success.main',
                      color: 'white',
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <TickCircle size={16} />
                    <Typography variant="caption" fontWeight={700}>
                      Face Captured
                    </Typography>
                  </Box>
                )}
              </Box>
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Camera Controls */}
              <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                {statusMessage && (
                  <Alert
                    severity={capturedDescriptor ? 'success' : uiState === 'error' ? 'error' : 'info'}
                    sx={{ mb: 2, borderRadius: 2 }}
                  >
                    {statusMessage}
                  </Alert>
                )}
                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <ScanBarcode size={20} />}
                    onClick={handleCapture}
                    disabled={isLoading || !!cameraError}
                    fullWidth
                    sx={{ borderRadius: 2, py: 1.2, fontWeight: 700 }}
                  >
                    {uiState === 'capturing' ? 'Scanning…' : 'Capture Face'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh size={18} />}
                    onClick={handleReset}
                    disabled={isLoading}
                    sx={{ borderRadius: 2, px: { xs: 1.5, sm: 3 }, minWidth: 'fit-content' }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>

          {/* ─── Right: Staff Selector + Action ──────────────────────────────── */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2.5}>
              {/* Desktop Staff Selector (hidden on mobile) */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                {renderStaffSelector()}
              </Box>

              {/* Register Action */}
              <Card
                sx={{
                  borderRadius: 3,
                  p: 2.5,
                  border: capturedDescriptor ? '2px solid' : '1px solid',
                  borderColor: capturedDescriptor ? 'success.main' : 'divider',
                  background: capturedDescriptor
                    ? 'linear-gradient(135deg, rgba(76,175,80,0.05) 0%, rgba(76,175,80,0.1) 100%)'
                    : 'background.paper'
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DocumentUpload size={20} />
                  Register Biometric
                </Typography>

                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Staff selected
                    </Typography>
                    <Chip
                      size="small"
                      label={selectedStaff ? '✓' : '✗'}
                      color={selectedStaff ? 'success' : 'default'}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Face captured
                    </Typography>
                    <Chip
                      size="small"
                      label={capturedDescriptor ? '✓ 128-dim' : '✗'}
                      color={capturedDescriptor ? 'success' : 'default'}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  size="large"
                  startIcon={
                    uiState === 'uploading' ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <TickCircle size={22} />
                    )
                  }
                  onClick={handleRegister}
                  disabled={!capturedDescriptor || !selectedStaff || isLoading}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.35)',
                    '&:not(:disabled):hover': {
                      boxShadow: '0 6px 20px rgba(76, 175, 80, 0.5)'
                    }
                  }}
                >
                  {uiState === 'uploading' ? 'Registering…' : 'Register Face'}
                </Button>
              </Card>

              {/* Instructions */}
              <Card sx={{ borderRadius: 3, p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="text.secondary">
                  📋 Instructions
                </Typography>
                <Stack spacing={0.8}>
                  {[
                    '1. Select the staff member from the dropdown',
                    '2. Ensure good lighting and face the camera directly',
                    '3. Keep a neutral expression, avoid accessories',
                    '4. Click "Capture Face" when ready',
                    '5. Review the snapshot, then click "Register Face"'
                  ].map((step) => (
                    <Typography key={step} variant="caption" color="text.secondary" display="block">
                      {step}
                    </Typography>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* ─── Eyewear Instruction Gate ──────────────────────────────────────── */}
      <EyewearGateDialog
        open={showEyewearGate}
        onConfirm={handleEyewearConfirmed}
        onCancel={() => setShowEyewearGate(false)}
      />
    </>
  );
};

// ─── Eyewear Gate Dialog ──────────────────────────────────────────────────────
interface EyewearGateProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const EyewearGateDialog: React.FC<EyewearGateProps> = ({ open, onConfirm, onCancel }) => {
  const [noSunglasses, setNoSunglasses] = React.useState(false);
  const [noSpecs, setNoSpecs] = React.useState(false);
  const canProceed = noSunglasses && noSpecs;

  const handleConfirm = () => {
    setNoSunglasses(false);
    setNoSpecs(false);
    onConfirm();
  };

  const handleCancel = () => {
    setNoSunglasses(false);
    setNoSpecs(false);
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        🕶️ Before You Capture
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          For accurate biometric registration, your eyes must be fully visible.
          Please confirm the following before proceeding:
        </Typography>
        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={noSunglasses}
                onChange={(e) => setNoSunglasses(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" fontWeight={500}>
                I have removed my sunglasses
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={noSpecs}
                onChange={(e) => setNoSpecs(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" fontWeight={500}>
                I have removed my glasses / spectacles
              </Typography>
            }
          />
        </Stack>
        {!canProceed && (
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2, fontSize: '0.8rem' }}>
            Tick both boxes to confirm you are ready.
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={handleCancel} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!canProceed}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          I've Removed Them — Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FaceRegister;
