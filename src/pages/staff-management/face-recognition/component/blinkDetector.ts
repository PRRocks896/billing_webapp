/**
 * Blink detector working on the Eye Aspect Ratio (EAR) stream.
 *
 * A fixed EAR threshold is unreliable: the open-eye EAR differs per person, camera and
 * head angle. Instead each sample is compared with the person's own recent open-eye
 * level, and a blink is "EAR drops clearly below that level, then comes back".
 *
 * Detection runs at only a few frames per second (face-api is heavy), so a blink is
 * usually seen as a single low frame followed by a normal one.
 */
const CLOSE_RATIO = 0.8; // closed when value < baseline * 0.8
const REOPEN_RATIO = 0.88; // reopened when value > baseline * 0.88
const MAX_CLOSED_MS = 1500; // "closed" for longer than a blink: tracking glitch or squint, start over

export interface BlinkOptions {
  window: number; // recent open-eye samples used as the baseline
  minSamples: number; // open-eye samples needed before judging
  minOpen: number; // baseline below this means the eyes are not really visible (eyewear)
  minDrop: number; // closing must also be at least this much lower in absolute terms (ignores jitter)
}

/** Defaults are tuned for EAR values (~0.3 when open). */
const EAR_OPTIONS: BlinkOptions = { window: 12, minSamples: 3, minOpen: 0.12, minDrop: 0.035 };

export interface BlinkDetector {
  /** Feed one EAR sample. Returns true once a full blink (close → open) is seen. */
  push: (ear: number) => boolean;
  /** Current EAR relative to the open-eye baseline (1 = fully open), for UI feedback. */
  level: () => number;
  reset: () => void;
}

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const createBlinkDetector = (options: BlinkOptions = EAR_OPTIONS): BlinkDetector => {
  const { window: WINDOW, minSamples: MIN_SAMPLES, minOpen: MIN_OPEN, minDrop: MIN_DROP } = options;
  const openSamples: number[] = [];
  let closed = false;
  let closedAt = 0;
  let lastLevel = 1;

  const reset = () => {
    openSamples.length = 0;
    closed = false;
    lastLevel = 1;
  };

  return {
    push(ear: number) {
      // While the eye is closed keep the baseline frozen, otherwise it decays
      // towards the closed value and a still-closed eye looks "reopened".
      if (!closed) {
        openSamples.push(ear);
        if (openSamples.length > WINDOW) openSamples.shift();
      }
      if (openSamples.length < MIN_SAMPLES) return false;

      // Median, not max: one noisy high reading must not make normal open eyes look closed
      const baseline = median(openSamples);
      lastLevel = baseline > 0 ? ear / baseline : 1;
      if (baseline < MIN_OPEN) return false;

      if (!closed) {
        if (ear < baseline * CLOSE_RATIO && baseline - ear > MIN_DROP) {
          closed = true;
          closedAt = Date.now();
        }
        return false;
      }

      if (ear > baseline * REOPEN_RATIO) return true;
      if (Date.now() - closedAt > MAX_CLOSED_MS) reset();
      return false;
    },
    level: () => lastLevel,
    reset
  };
};
