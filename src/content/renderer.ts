import type { PoseFrame } from "../shared/types";

const SKELETON_CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [1, 4],
  [4, 5],
  [5, 6],
  [1, 7],
  [7, 8],
  [8, 9],
  [7, 10],
  [10, 11]
];

export type RenderStyle = {
  color: string;
  opacity: number;
  lineWidth: number;
  mirrorMode: boolean;
};

export class SkeletonRenderer {
  constructor(private readonly canvas: HTMLCanvasElement) {}

  clear(): void {
    const context = this.canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(frame: PoseFrame | null, style: RenderStyle): void {
    const context = this.canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!frame) {
      return;
    }

    context.save();
    context.strokeStyle = style.color;
    context.fillStyle = style.color;
    context.globalAlpha = style.opacity;
    context.lineWidth = style.lineWidth;
    context.lineCap = "round";
    context.shadowColor = style.color;
    context.shadowBlur = 18;

    const width = this.canvas.width;
    const pointAt = (index: number) => {
      const point = frame.points[index];
      return {
        x: style.mirrorMode ? width - point.x : point.x,
        y: point.y
      };
    };

    for (const [startIndex, endIndex] of SKELETON_CONNECTIONS) {
      const start = pointAt(startIndex);
      const end = pointAt(endIndex);

      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }

    for (let index = 0; index < frame.points.length; index += 1) {
      const point = pointAt(index);
      context.beginPath();
      context.arc(point.x, point.y, Math.max(3, style.lineWidth * 0.75), 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }
}
