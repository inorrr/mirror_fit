export type OverlayElements = {
  root: HTMLDivElement;
  canvas: HTMLCanvasElement;
  message: HTMLDivElement;
  videoContainer: HTMLDivElement;
  video: HTMLVideoElement;
};

export function createOverlay(): OverlayElements {
  const existingRoot = document.getElementById("mirrorfit-root");
  if (existingRoot) {
    existingRoot.remove();
  }

  const root = document.createElement("div");
  root.id = "mirrorfit-root";

  const canvas = document.createElement("canvas");
  canvas.id = "mirrorfit-overlay-canvas";

  const message = document.createElement("div");
  message.id = "mirrorfit-message";
  message.textContent = "";

  const videoContainer = document.createElement("div");
  videoContainer.id = "mirrorfit-video";

  const video = document.createElement("video");
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;

  videoContainer.appendChild(video);
  root.append(canvas, message, videoContainer);
  document.documentElement.appendChild(root);

  return { root, canvas, message, videoContainer, video };
}

export function resizeCanvas(canvas: HTMLCanvasElement): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
