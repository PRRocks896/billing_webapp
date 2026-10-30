/**
 * Head-turn liveness challenge.
 *
 * The person must face the camera, turn their head the requested way, then face the
 * camera again. A flat photo (printed or on a screen) keeps the same nose/jaw ratio
 * however it is moved, so it cannot complete a random direction.
 *
 * Thresholds mirror the server (backend api/admin/face/liveness.service.js).
 */
export type TurnDirection = 'left' | 'right';
export type ChallengeStep = 'centre' | 'turn' | 'return' | 'done';

const CENTRE_YAW = 0.1;
const TARGET_YAW = 0.18;
const MAX_SAMPLES = 120;

export interface ChallengeTracker {
  /** Feed one yaw reading; returns the step the person is now on. */
  push: (yaw: number) => ChallengeStep;
  step: () => ChallengeStep;
  /** Yaw readings to send as proof (downsampled to fit the server limit). */
  proof: () => number[];
}

export const createChallengeTracker = (direction: TurnDirection): ChallengeTracker => {
  const sign = direction === 'left' ? 1 : -1;
  const samples: number[] = [];
  let step: ChallengeStep = 'centre';

  return {
    push(yaw) {
      samples.push(Math.round(yaw * 1000) / 1000);
      if (step === 'centre' && Math.abs(yaw) < CENTRE_YAW) step = 'turn';
      else if (step === 'turn' && sign * yaw > TARGET_YAW) step = 'return';
      else if (step === 'return' && Math.abs(yaw) < CENTRE_YAW) step = 'done';
      return step;
    },
    step: () => step,
    proof() {
      if (samples.length <= MAX_SAMPLES) return [...samples];
      const stride = samples.length / MAX_SAMPLES;
      return Array.from({ length: MAX_SAMPLES }, (_, i) => samples[Math.floor(i * stride)]);
    }
  };
};
