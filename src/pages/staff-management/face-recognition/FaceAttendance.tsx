import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
  Camera,
  CameraSlash,
  TickCircle,
  CloseCircle,
  Scanner,
  Refresh,
  Timer,
  Warning2
} from 'iconsax-reactjs';
import { useSnackbar } from 'notistack';
import { loadModels, detectDescriptor, drawDetections, detectEAR } from 'utils/faceApi';
import { verifyFace } from 'service/face';
import useAuth from 'hooks/useAuth';
import moment from 'moment';
import useGeoLocation from 'hooks/useGeoLocation';

// ─── Animations ──────────────────────────────────────────────────────────────
const scanLine = keyframes`
  0%   { top: 0%; }
  100% { top: 100%; }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
  50%       { box-shadow: 0 0 0 20px rgba(102, 126, 234, 0); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Types ────────────────────────────────────────────────────────────────────
type KioskState = 'loading-models' | 'camera-error' | 'scanning' | 'liveness-check' | 'processing' | 'success' | 'fail';

interface MatchResult {
  matched: boolean;
  staff?: {
    id: number;
    name: string;
    nickName?: string;
    staffPhoto?: string;
  };
  action?: string;
  timestamp?: string;
  distance?: number;
  reason?: string;
}

// ─── Recent log entry ─────────────────────────────────────────────────────────
interface LogEntry {
  id: number;
  name: string;
  action: string;
  time: string;
  success: boolean;
}

const SCAN_INTERVAL_MS = 2500;
const RESULT_DISPLAY_MS = 3500;

// ─── Component ────────────────────────────────────────────────────────────────
const FaceAttendance: React.FC = () => {
  const { user } = useAuth();
  const { location } = useGeoLocation();
  const { enqueueSnackbar } = useSnackbar();

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingRef = useRef(false);

  const [kioskState, setKioskState] = useState<KioskState>('loading-models');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'));
  const [faceDetected, setFaceDetected] = useState(false);
  const [recentLog, setRecentLog] = useState<LogEntry[]>([]);
  const [scanCount, setScanCount] = useState(0);

  // ── Clock ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(moment().format('HH:mm:ss')), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Start camera ─────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraOn(true);
      }
    } catch (err: any) {
      const msg =
        err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera permissions and refresh.'
          : `Camera error: ${err.message}`;
      setCameraError(msg);
      setKioskState('camera-error');
    }
  }, []);

  // ── Stop camera ──────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraOn(false);
  }, []);

  // ── Clear scan timer ─────────────────────────────────────────────────────
  const clearScanTimer = useCallback(() => {
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
  }, []);

  const livenessReqRef = useRef<number | null>(null);
  const isLivenessActiveRef = useRef(false);

  const stopLivenessCheck = useCallback(() => {
    isLivenessActiveRef.current = false;
    if (livenessReqRef.current) {
      cancelAnimationFrame(livenessReqRef.current);
      livenessReqRef.current = null;
    }
  }, []);

  const runScanRef = useRef<() => Promise<void>>(async () => { });

  // ── Schedule next scan ───────────────────────────────────────────────────
  const scheduleScan = useCallback(
    (delayMs = SCAN_INTERVAL_MS) => {
      clearScanTimer();
      scanTimerRef.current = setTimeout(() => {
        if (runScanRef.current) {
          runScanRef.current();
        }
      }, delayMs);
    },
    [clearScanTimer]
  );

  // ── Draw live face overlay ────────────────────────────────────────────────
  const drawOverlay = useCallback(async () => {
    if (!videoRef.current || !overlayCanvasRef.current || !isCameraOn) return;
    try {
      const detected = await drawDetections(videoRef.current, overlayCanvasRef.current);
      setFaceDetected(detected);
    } catch {
      /* ignore transient errors */
    }
  }, [isCameraOn]);

  // ── Main scan loop ────────────────────────────────────────────────────────
  const runScan = useCallback(async () => {
    if (isProcessingRef.current || !videoRef.current || !isCameraOn) return;
    isProcessingRef.current = true;
    setScanCount((c) => c + 1);

    try {
      await drawOverlay();

      // Step 1: Detect if a face is present
      const { ear } = await detectEAR(videoRef.current, { minConfidence: 0.55 });

      if (ear === null) {
        // No face — keep scanning silently
        setFaceDetected(false);
        isProcessingRef.current = false;
        scheduleScan();
        return;
      }

      // Face found! Start liveness check.
      setFaceDetected(true);

      // Face is clear — start liveness check.
      setKioskState('liveness-check');
      isLivenessActiveRef.current = true;

      let isBlinking = false;
      let blinkCount = 0;
      let livenessStartTime = Date.now();
      const EAR_THRESHOLD = 0.32;
      const MAX_LIVENESS_WAIT_MS = 15000;

      const checkLiveness = async () => {
        if (!isLivenessActiveRef.current || !videoRef.current) return;

        // Timeout
        if (Date.now() - livenessStartTime > MAX_LIVENESS_WAIT_MS) {
          stopLivenessCheck();
          setKioskState('fail');
          setMatchResult({ matched: false, reason: 'Liveness check failed (no blink detected)' });
          setTimeout(() => {
            setMatchResult(null);
            setKioskState('scanning');
            isProcessingRef.current = false;
            scheduleScan(500);
          }, RESULT_DISPLAY_MS);
          return;
        }

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
            proceedToVerification();
          } else {
            if (isLivenessActiveRef.current) {
              livenessReqRef.current = requestAnimationFrame(checkLiveness);
            }
          }
        } catch (err) {
          if (isLivenessActiveRef.current) {
            livenessReqRef.current = requestAnimationFrame(checkLiveness);
          }
        }
      };

      checkLiveness();

    } catch (err: any) {
      console.error('[FaceAttendance] scan error:', err);
      isProcessingRef.current = false;
      setKioskState('scanning');
      scheduleScan();
    }
  }, [isCameraOn, location, drawOverlay, scheduleScan, stopLivenessCheck]);

  const proceedToVerification = async () => {
    setKioskState('processing');

    try {
      const { descriptor, error } = await detectDescriptor(videoRef.current!, { minConfidence: 0.55 });

      if (!descriptor) {
        setKioskState('fail');
        setMatchResult({ matched: false, reason: error || 'Failed to extract face features' });
        setTimeout(() => {
          setMatchResult(null);
          setKioskState('scanning');
          isProcessingRef.current = false;
          scheduleScan(500);
        }, RESULT_DISPLAY_MS);
        return;
      }

      const today = moment().format('YYYY-MM-DD');
      const now = moment().format('HH:mm:ss');

      const res: any = await verifyFace({
        descriptor,
        userID: user?.id,
        latitude: `${location?.latitude}`,
        longitude: `${location?.longitude}`,
        date: today,
        time: now
      });

      const data = res?.data;
      const success = res?.success;

      if (success && data?.matched) {
        setMatchResult(data);
        setKioskState('success');
        enqueueSnackbar(`✅ Attendance marked for ${data.staff?.name}`, { variant: 'success' });
        setRecentLog((prev) =>
          [
            {
              id: Date.now(),
              name: data.staff?.name || 'Unknown',
              action: data.action || 'clock-in',
              time: moment().format('HH:mm:ss'),
              success: true
            },
            ...prev
          ].slice(0, 5)
        );
      } else {
        setMatchResult({ matched: false, reason: data?.reason || data?.message || 'Face not recognised' });
        setKioskState('fail');
        if (error !== 'No face detected') {
          enqueueSnackbar(data?.reason || data?.message || 'Face not recognised', { variant: 'warning' });
        }
      }

      // Auto-resume after displaying result
      setTimeout(() => {
        setMatchResult(null);
        setKioskState('scanning');
        isProcessingRef.current = false;
        scheduleScan(500);
      }, RESULT_DISPLAY_MS);
    } catch (err: any) {
      console.error('[FaceAttendance] verify error:', err);
      setKioskState('fail');
      setMatchResult({ matched: false, reason: err?.message || 'Verification failed' });
      setTimeout(() => {
        setMatchResult(null);
        setKioskState('scanning');
        isProcessingRef.current = false;
        scheduleScan();
      }, RESULT_DISPLAY_MS);
    }
  };

  // Update ref to latest runScan
  useEffect(() => {
    runScanRef.current = runScan;
  }, [runScan]);

  // ── Initialise models + camera ───────────────────────────────────────────
  useEffect(() => {
    let active = true;
    const init = async () => {
      setKioskState('loading-models');
      try {
        await loadModels();
        if (!active) return;
        await startCamera();
        if (!active) return;
        setKioskState('scanning');
      } catch {
        if (!active) return;
        setKioskState('camera-error');
      }
    };
    init();
    return () => {
      active = false;
      clearScanTimer();
      stopLivenessCheck();
      stopCamera();
    };
  }, [startCamera, stopCamera, clearScanTimer, stopLivenessCheck]);

  // ── Start scan loop when scanning state is active ────────────────────────
  useEffect(() => {
    if (kioskState === 'scanning' && isCameraOn) {
      scheduleScan(1000);
    }
    return () => clearScanTimer();
  }, [kioskState, isCameraOn, scheduleScan, clearScanTimer]);

  // ── Restart camera ───────────────────────────────────────────────────────
  const handleRestart = useCallback(async () => {
    clearScanTimer();
    stopLivenessCheck();
    stopCamera();
    isProcessingRef.current = false;
    setMatchResult(null);
    await startCamera();
    setKioskState('scanning');
  }, [clearScanTimer, stopLivenessCheck, stopCamera, startCamera]);

  // ─── Render helpers ───────────────────────────────────────────────────────
  const stateColors: Record<KioskState, string> = {
    'loading-models': '#667eea',
    'camera-error': '#f44336',
    scanning: '#667eea',
    'liveness-check': '#2196f3',
    processing: '#ff9800',
    success: '#4caf50',
    fail: '#f44336'
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(102,126,234,0.15) 0%, transparent 60%)',
          pointerEvents: 'none'
        }
      }}
    >
      {/* ─── Top Bar ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          px: { xs: 2, sm: 4 },
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Scanner size={22} color="#fff" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} color="white" lineHeight={1.2}>
              Face Attendance
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.5)">
              AI-Powered Biometric Recognition
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' }
          }}
        >
          {/* Live indicator */}
          {kioskState === 'scanning' && (
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#4caf50',
                  animation: `${pulse} 2s infinite`
                }}
              />
              <Typography variant="caption" color="rgba(255,255,255,0.7)" fontWeight={600}>
                LIVE
              </Typography>
            </Stack>
          )}
          {/* Clock & Date & Restart */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Timer size={16} color="rgba(255,255,255,0.6)" />
              <Typography variant="h6" color="white" fontWeight={700} fontFamily="monospace">
                {currentTime}
              </Typography>
            </Stack>
            <Typography variant="body2" color="rgba(255,255,255,0.5)">
              {moment().format('DD MMM YYYY')}
            </Typography>
            {/* Restart button */}
            <IconButton onClick={handleRestart} size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <Refresh size={20} />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* ─── Eyewear Instruction Notice ───────────────────────────────── */}
      <Box
        sx={{
          mx: { xs: 2, sm: 3 },
          mt: 1.5,
          p: 1.5,
          borderRadius: 2,
          bgcolor: 'rgba(255, 152, 0, 0.12)',
          border: '1px solid rgba(255, 152, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}
      >
        <Typography sx={{ fontSize: '1.2rem', lineHeight: 1 }}>🕶️</Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.85)" fontWeight={500}>
          Please <strong>remove all sunglasses and eyewear</strong> before scanning your face.
          Eyewear reduces recognition accuracy.
        </Typography>
      </Box>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 3 },
          p: { xs: 2, md: 3 }
        }}
      >
        {/* ── Camera Feed (Left) ──────────────────────────────────────────── */}
        <Box sx={{ flex: 2, position: 'relative', display: 'flex', flexDirection: 'column', width: '100%' }}>
          {/* Camera viewport */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: { xs: '3/4', sm: '4/3' },
              borderRadius: 4,
              overflow: 'hidden',
              border: `2px solid ${stateColors[kioskState]}`,
              boxShadow: `0 0 30px ${stateColors[kioskState]}33`,
              transition: 'border-color 0.5s, box-shadow 0.5s',
              bgcolor: '#0a0a0a'
            }}
          >
            {/* Loading overlay */}
            {kioskState === 'loading-models' && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  zIndex: 10
                }}
              >
                <CircularProgress size={64} thickness={2} sx={{ color: '#667eea' }} />
                <Typography color="rgba(255,255,255,0.8)" fontWeight={600}>
                  Loading AI Models…
                </Typography>
                <LinearProgress sx={{ width: 200, borderRadius: 1 }} />
              </Box>
            )}

            {/* Camera error */}
            {kioskState === 'camera-error' && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  zIndex: 10
                }}
              >
                <CameraSlash size={64} color="#f44336" />
                <Typography color="white" textAlign="center" px={4}>
                  {cameraError || 'Camera not available'}
                </Typography>
              </Box>
            )}

            {/* Face guide ellipse */}
            {(kioskState === 'scanning' || kioskState === 'processing') && (
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
                    width: { xs: 240, sm: 320 },
                    height: { xs: 300, sm: 400 },
                    border: '2px dashed rgba(255,255,255,0.4)',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 4000px rgba(0,0,0,0.4)',
                    transition: 'all 0.3s'
                  }}
                />
              </Box>
            )}

            {/* Liveness Check Overlay */}
            {kioskState === 'liveness-check' && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 5,
                  p: 2,
                  textAlign: 'center'
                }}
              >
                <CircularProgress color="primary" size={60} thickness={3} sx={{ mb: 2 }} />
                <Typography fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  Face Detected
                </Typography>
                <Typography fontWeight={500} sx={{ animation: `${pulse} 1.5s infinite`, px: { xs: 2, sm: 3 }, py: 1, borderRadius: 2, bgcolor: 'rgba(33, 150, 243, 0.2)', fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                  Please blink your eyes to verify
                </Typography>
              </Box>
            )}

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
                transform: 'scaleX(-1)'
              }}
            />

            {/* Face landmark overlay canvas */}
            <canvas
              ref={overlayCanvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transform: 'scaleX(-1)',
                pointerEvents: 'none'
              }}
            />

            {/* Scanning line animation */}
            {kioskState === 'scanning' && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
                  animation: `${scanLine} 2.5s linear infinite`,
                  pointerEvents: 'none'
                }}
              />
            )}

            {/* Face guide ellipse */}
            {(kioskState === 'scanning' || kioskState === 'processing') && (
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
                    width: { xs: 180, sm: 220 },
                    height: { xs: 230, sm: 280 },
                    border: `3px solid ${faceDetected ? '#4caf50' : 'rgba(255,255,255,0.3)'}`,
                    borderRadius: '50%',
                    transition: 'border-color 0.3s',
                    animation: faceDetected ? `${pulse} 1.5s infinite` : 'none',
                    boxShadow: faceDetected ? '0 0 30px rgba(76,175,80,0.5)' : 'none'
                  }}
                />
              </Box>
            )}

            {/* Processing spinner */}
            {kioskState === 'processing' && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.6)',
                  gap: 2,
                  zIndex: 5
                }}
              >
                <CircularProgress size={80} thickness={2} sx={{ color: '#ff9800' }} />
                <Typography color="white" fontWeight={700} variant="h6">
                  Verifying Identity…
                </Typography>
              </Box>
            )}

            {/* Success overlay */}
            {kioskState === 'success' && matchResult?.matched && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.75)',
                  gap: 2.5,
                  animation: `${fadeInUp} 0.4s ease`,
                  zIndex: 5,
                  p: 2
                }}
              >
                <TickCircle size={64} color="#4caf50" variant="Bold" />
                <Box textAlign="center">
                  <Typography color="#4caf50" fontWeight={900} sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    {matchResult.action === 'clock-in' ? 'Clock In' : 'Clock Out'}
                  </Typography>
                  <Typography color="white" fontWeight={700} mt={0.5} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                    {matchResult.staff?.name}
                  </Typography>
                  {matchResult.staff?.nickName && (
                    <Typography color="rgba(255,255,255,0.6)" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                      {matchResult.staff.nickName}
                    </Typography>
                  )}
                  <Chip
                    label={matchResult.timestamp || currentTime}
                    sx={{
                      mt: 1.5,
                      color: 'white',
                      bgcolor: 'rgba(76,175,80,0.3)',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Fail overlay */}
            {kioskState === 'fail' && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.75)',
                  gap: 2,
                  animation: `${fadeInUp} 0.4s ease`,
                  zIndex: 5,
                  p: 2
                }}
              >
                <CloseCircle size={64} color="#f44336" variant="Bold" />
                <Typography color="#f44336" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                  Not Recognised
                </Typography>
                <Typography color="rgba(255,255,255,0.7)" textAlign="center" px={2} variant="body2">
                  {matchResult?.reason || 'Face not found in system. Please register first.'}
                </Typography>
              </Box>
            )}

            {/* Bottom status strip */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 1.5,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                {isCameraOn ? (
                  <Camera size={16} color="#4caf50" />
                ) : (
                  <CameraSlash size={16} color="#f44336" />
                )}
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  {isCameraOn ? 'Camera active' : 'Camera offline'}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                {faceDetected && kioskState === 'scanning' && (
                  <Chip
                    label="Face Detected"
                    size="small"
                    sx={{ bgcolor: 'rgba(76,175,80,0.3)', color: '#a5d6a7', fontWeight: 600 }}
                  />
                )}
                <Typography variant="caption" color="rgba(255,255,255,0.4)">
                  Scan #{scanCount}
                </Typography>
              </Stack>
            </Box>
          </Box>

          {/* Status message bar */}
          <Box
            sx={{
              mt: 2,
              px: 3,
              py: 1.5,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: stateColors[kioskState],
                flexShrink: 0,
                ...(kioskState === 'scanning' && { animation: `${pulse} 2s infinite` })
              }}
            />
            <Typography color="rgba(255,255,255,0.8)" variant="body2" fontWeight={500}>
              {kioskState === 'loading-models' && 'Initialising face recognition models…'}
              {kioskState === 'scanning' && 'Scanning for faces — look directly at the camera'}
              {kioskState === 'processing' && 'Matching face against database…'}
              {kioskState === 'success' && `✅ Attendance recorded for ${matchResult?.staff?.name}`}
              {kioskState === 'fail' && `❌ ${matchResult?.reason || 'Face not recognised'}`}
              {kioskState === 'camera-error' && cameraError}
            </Typography>
          </Box>
        </Box>

        {/* ── Right Panel ────────────────────────────────────────────────────── */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
          {/* Today's Stats */}
          <Card
            sx={{
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white'
            }}
          >
            <Box sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" color="rgba(255,255,255,0.5)" fontWeight={600} mb={2} textTransform="uppercase" letterSpacing={1}>
                Today's Summary
              </Typography>
              <Typography variant="h3" fontWeight={900} color="#667eea">
                {moment().format('DD')}
              </Typography>
              <Typography color="rgba(255,255,255,0.6)" variant="body2">
                {moment().format('MMMM YYYY')}
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              <Stack direction="row" justifyContent="space-between">
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={800} color="#4caf50">
                    {recentLog.filter((l) => l.success).length}
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.4)">
                    Marked
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={800} color="#667eea">
                    {scanCount}
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.4)">
                    Scans
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={800} color="#ff9800">
                    {recentLog.filter((l) => !l.success).length}
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.4)">
                    Failed
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Card>

          {/* Recent Activity */}
          <Card
            sx={{
              borderRadius: 3,
              flex: 1,
              bgcolor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography variant="subtitle2" color="rgba(255,255,255,0.5)" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
                Recent Activity
              </Typography>
            </Box>
            <Box sx={{ p: 1.5 }}>
              {recentLog.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Scanner size={48} color="rgba(255,255,255,0.15)" />
                  <Typography color="rgba(255,255,255,0.3)" variant="body2" mt={1.5}>
                    No attendance marked yet.
                    <br />
                    Look at the camera to start.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1}>
                  {recentLog.map((entry) => (
                    <Box
                      key={entry.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: entry.success
                          ? 'rgba(76,175,80,0.1)'
                          : 'rgba(244,67,54,0.1)',
                        border: `1px solid ${entry.success ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)'}`,
                        animation: `${fadeInUp} 0.3s ease`
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: entry.success ? '#4caf50' : '#f44336',
                          fontSize: '0.9rem',
                          fontWeight: 700
                        }}
                      >
                        {entry.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="white" fontWeight={600} noWrap>
                          {entry.name}
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.5)">
                          {entry.action === 'clock-in' ? '🟢 Clock In' : '🔴 Clock Out'} • {entry.time}
                        </Typography>
                      </Box>
                      {entry.success ? (
                        <TickCircle size={18} color="#4caf50" variant="Bold" />
                      ) : (
                        <Warning2 size={18} color="#ff9800" variant="Bold" />
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Card>

          {/* Instructions */}
          <Card
            sx={{
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              p: 2
            }}
          >
            <Typography variant="caption" color="rgba(255,255,255,0.3)" display="block" mb={1} fontWeight={600} textTransform="uppercase">
              How to use
            </Typography>
            {['1. Stand in front of camera (50–80 cm)', '2. Ensure good lighting on your face', '3. Keep neutral expression', '4. Wait for green circle confirmation'].map(
              (tip) => (
                <Typography key={tip} variant="caption" color="rgba(255,255,255,0.35)" display="block" lineHeight={1.8}>
                  {tip}
                </Typography>
              )
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default FaceAttendance;
