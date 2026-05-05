import type { PoseFrame } from "../shared/types";

export class MovementDetector {
  private previousFrame: PoseFrame | null = null;
  private lastTriggerAt = 0;

  constructor(
    private readonly movementThreshold = 16,
    private readonly cooldownMs = 6000
  ) {}

  shouldTrigger(frame: PoseFrame | null): boolean {
    if (!frame || !this.previousFrame) {
      this.previousFrame = frame;
      return false;
    }

    const totalDistance = frame.points.reduce((sum, point, index) => {
      const previousPoint = this.previousFrame?.points[index];
      if (!previousPoint) {
        return sum;
      }

      const dx = point.x - previousPoint.x;
      const dy = point.y - previousPoint.y;
      return sum + Math.hypot(dx, dy);
    }, 0);

    this.previousFrame = frame;

    const averageDistance = totalDistance / frame.points.length;
    const now = performance.now();
    const cooldownElapsed = now - this.lastTriggerAt > this.cooldownMs;

    if (averageDistance > this.movementThreshold && cooldownElapsed) {
      this.lastTriggerAt = now;
      return true;
    }

    return false;
  }
}
