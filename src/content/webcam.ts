export class WebcamController {
  private stream: MediaStream | null = null;

  async start(video: HTMLVideoElement): Promise<void> {
    if (this.stream) {
      video.srcObject = this.stream;
      return;
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });

    video.srcObject = this.stream;
    await video.play();
  }

  stop(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }
}
