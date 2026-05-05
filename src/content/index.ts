import { createOverlay, resizeCanvas } from "./overlay";
import { PoseEngine } from "./pose-engine";
import { SkeletonRenderer } from "./renderer";
import { WebcamController } from "./webcam";
import { MovementDetector } from "./movement-detector";
import { MessageSystem } from "./message-system";
import { defaultSettings, getStoredSettings } from "../shared/settings";
import type { MirrorFitMessage, MirrorFitSettings } from "../shared/types";

class MirrorFitApp {
  private settings: MirrorFitSettings = defaultSettings;
  private readonly overlay = createOverlay();
  private readonly webcam = new WebcamController();
  private readonly poseEngine = new PoseEngine();
  private readonly renderer = new SkeletonRenderer(this.overlay.canvas);
  private readonly movementDetector = new MovementDetector();
  private readonly messages = new MessageSystem(this.overlay.message);
  private animationFrame = 0;

  async init(): Promise<void> {
    resizeCanvas(this.overlay.canvas);
    this.settings = await getStoredSettings();
    this.applySettings();
    this.attachEvents();

    if (this.settings.enabled) {
      await this.start();
    }
  }

  private attachEvents(): void {
    window.addEventListener("resize", () => resizeCanvas(this.overlay.canvas));

    chrome.runtime.onMessage.addListener((message: MirrorFitMessage) => {
      if (message.type === "MIRRORFIT_SETTINGS") {
        this.settings = message.payload;
        this.applySettings();
        void this.syncRunState();
      }

      if (message.type === "MIRRORFIT_TOGGLE") {
        this.settings = { ...this.settings, enabled: !this.settings.enabled };
        this.applySettings();
        void this.syncRunState();
      }
    });
  }

  private applySettings(): void {
    this.overlay.root.style.display = this.settings.enabled ? "block" : "none";
    this.overlay.videoContainer.style.display = this.settings.enabled ? "block" : "none";
  }

  private async syncRunState(): Promise<void> {
    if (this.settings.enabled) {
      await this.start();
      return;
    }

    this.stop();
  }

  private async start(): Promise<void> {
    if (this.animationFrame) {
      return;
    }

    await this.webcam.start(this.overlay.video);

    const tick = async () => {
      const pose = await this.poseEngine.estimate(this.overlay.video);
      this.renderer.draw(pose, {
        color: this.settings.color,
        opacity: this.settings.opacity,
        lineWidth: this.settings.lineWidth,
        mirrorMode: this.settings.mirrorMode
      });

      if (this.settings.messagesEnabled && this.movementDetector.shouldTrigger(pose)) {
        this.messages.showRandomMessage();
      }

      this.animationFrame = window.requestAnimationFrame(() => {
        void tick();
      });
    };

    await tick();
  }

  private stop(): void {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    }

    this.webcam.stop();
    this.renderer.clear();
  }
}

const app = new MirrorFitApp();
void app.init();
