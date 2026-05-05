import type { PoseFrame } from "../shared/types";

const LANDMARK_COUNT = 12;

export class PoseEngine {
  async estimate(video: HTMLVideoElement): Promise<PoseFrame | null> {
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return null;
    }

    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.48;
    const elapsed = performance.now() / 1000;

    // Placeholder pose points until MediaPipe is integrated.
    const points = Array.from({ length: LANDMARK_COUNT }, (_, index) => ({
      x: centerX + Math.sin(elapsed * 1.2 + index) * (80 + index * 6),
      y: centerY + Math.cos(elapsed * 1.1 + index) * (110 - index * 4),
      confidence: 0.9
    }));

    return {
      points,
      timestamp: performance.now()
    };
  }
}
