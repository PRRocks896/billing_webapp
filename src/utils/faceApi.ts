/**
 * faceApi.ts
 * Wrapper around face-api.js for model loading and descriptor extraction.
 * Models are served from /models/ (public directory).
 */
import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

const MODEL_URL = '/models';

/**
 * Load all three required face-api.js models once.
 * Subsequent calls return immediately if already loaded.
 */
export async function loadModels(): Promise<void> {
  if (modelsLoaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    console.log('[faceApi] Loading face detection models...');
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);
    modelsLoaded = true;
    console.log('[faceApi] ✅ All models loaded');
  })();

  return loadingPromise;
}

/**
 * Extract a 128-dimension face descriptor from a video or canvas element.
 * Returns the descriptor as number[] or null if:
 *  - no face detected
 *  - multiple faces detected
 */
export async function detectDescriptor(
  mediaEl: HTMLVideoElement | HTMLCanvasElement,
  options?: { minConfidence?: number }
): Promise<{ descriptor: number[] | null; error?: string }> {
  const detectionOptions = new faceapi.SsdMobilenetv1Options({
    minConfidence: options?.minConfidence ?? 0.5
  });

  const detections = await faceapi
    .detectAllFaces(mediaEl, detectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (detections.length === 0) {
    return { descriptor: null, error: 'No face detected. Please look directly at the camera.' };
  }
  if (detections.length > 1) {
    return {
      descriptor: null,
      error: `Multiple faces detected (${detections.length}). Please ensure only one person is in frame.`
    };
  }

  // Convert Float32Array → plain number[] for JSON serialisation
  return { descriptor: Array.from(detections[0].descriptor) };
}

/**
 * Draw face detection overlays on a canvas element (for live preview).
 */
export async function drawDetections(
  videoEl: HTMLVideoElement,
  canvasEl: HTMLCanvasElement
): Promise<boolean> {
  const displaySize = { width: videoEl.videoWidth, height: videoEl.videoHeight };
  faceapi.matchDimensions(canvasEl, displaySize);

  const detectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
  const detections = await faceapi.detectAllFaces(videoEl, detectionOptions).withFaceLandmarks();

  const resized = faceapi.resizeResults(detections, displaySize);
  const ctx = canvasEl.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }
  faceapi.draw.drawDetections(canvasEl, resized);
  faceapi.draw.drawFaceLandmarks(canvasEl, resized);

  return detections.length === 1;
}

/**
 * Calculate the Eye Aspect Ratio (EAR) for a given eye's landmarks.
 */
function getEAR(eyePoints: faceapi.Point[]): number {
  if (eyePoints.length !== 6) return 0;
  const v1 = Math.hypot(eyePoints[1].x - eyePoints[5].x, eyePoints[1].y - eyePoints[5].y);
  const v2 = Math.hypot(eyePoints[2].x - eyePoints[4].x, eyePoints[2].y - eyePoints[4].y);
  const h = Math.hypot(eyePoints[0].x - eyePoints[3].x, eyePoints[0].y - eyePoints[3].y);
  return (v1 + v2) / (2.0 * h);
}

/**
 * Detects a face and returns the average EAR (Eye Aspect Ratio) of both eyes.
 * Useful for blink detection (liveness).
 */
export async function detectEAR(
  mediaEl: HTMLVideoElement | HTMLCanvasElement,
  options?: { minConfidence?: number }
): Promise<{ ear: number | null; error?: string }> {
  const detectionOptions = new faceapi.SsdMobilenetv1Options({
    minConfidence: options?.minConfidence ?? 0.5
  });

  const detection = await faceapi
    .detectSingleFace(mediaEl, detectionOptions)
    .withFaceLandmarks();

  if (!detection) {
    return { ear: null, error: 'No face detected.' };
  }

  const leftEye = detection.landmarks.getLeftEye();
  const rightEye = detection.landmarks.getRightEye();

  const leftEAR = getEAR(leftEye);
  const rightEAR = getEAR(rightEye);
  const avgEAR = (leftEAR + rightEAR) / 2.0;

  return { ear: avgEAR };
}

export { faceapi };
