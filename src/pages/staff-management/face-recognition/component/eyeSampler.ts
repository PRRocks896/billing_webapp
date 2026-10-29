import { EyeBox } from 'utils/faceApi';

const W = 32;
const H = 16;

/**
 * Measures how "open" the eyes look straight from the video pixels.
 *
 * An open eye has a dark iris/pupil next to white sclera, so the luminance inside the
 * eye box varies a lot. A closed eyelid is an almost uniform patch of skin, so the
 * variation collapses. The value is the luminance standard deviation averaged over the
 * given eye boxes; only its change relative to the person's own baseline matters.
 *
 * It is cheap (two 32x16 reads), so it can run on every animation frame and catch a
 * blink that the much slower face detection would miss between two frames.
 */
export const createEyeSampler = () => {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  return (video: HTMLVideoElement, boxes: EyeBox[]): number | null => {
    if (!ctx || !boxes.length || !video.videoWidth) return null;

    let total = 0;
    let used = 0;
    for (const box of boxes) {
      // keep the source rectangle inside the frame
      const x = Math.max(0, Math.min(box.x, video.videoWidth - 2));
      const y = Math.max(0, Math.min(box.y, video.videoHeight - 2));
      const w = Math.min(box.w, video.videoWidth - x);
      const h = Math.min(box.h, video.videoHeight - y);
      if (w < 4 || h < 2) continue;

      ctx.drawImage(video, x, y, w, h, 0, 0, W, H);
      const { data } = ctx.getImageData(0, 0, W, H);
      const n = data.length / 4;
      let sum = 0;
      let sumSq = 0;
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        sum += lum;
        sumSq += lum * lum;
      }
      const mean = sum / n;
      total += Math.sqrt(Math.max(sumSq / n - mean * mean, 0));
      used++;
    }
    return used ? total / used : null;
  };
};
