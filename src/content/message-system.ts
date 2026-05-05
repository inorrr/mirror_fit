const DEFAULT_MESSAGES = [
  "Let's go",
  "Good movement",
  "Stay with it",
  "Nice form",
  "Main character energy",
  "You're cooking",
  "We love effort"
];

export class MessageSystem {
  private hideTimeout: number | null = null;

  constructor(private readonly element: HTMLDivElement) {}

  showRandomMessage(): void {
    const nextMessage =
      DEFAULT_MESSAGES[Math.floor(Math.random() * DEFAULT_MESSAGES.length)] ?? DEFAULT_MESSAGES[0];

    this.element.textContent = nextMessage;
    this.element.dataset.visible = "true";

    if (this.hideTimeout) {
      window.clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = window.setTimeout(() => {
      this.element.dataset.visible = "false";
    }, 2200);
  }
}
