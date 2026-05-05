import { defaultSettings, getStoredSettings, setStoredSettings } from "../shared/settings";
import type { MirrorFitSettings } from "../shared/types";

const ids = {
  toggle: "toggle-extension",
  color: "color",
  opacity: "opacity",
  lineWidth: "line-width",
  mirrorMode: "mirror-mode",
  messagesEnabled: "messages-enabled"
} as const;

async function getActiveTabId(): Promise<number | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id;
}

function getElements() {
  return {
    toggle: document.getElementById(ids.toggle) as HTMLButtonElement,
    color: document.getElementById(ids.color) as HTMLInputElement,
    opacity: document.getElementById(ids.opacity) as HTMLInputElement,
    lineWidth: document.getElementById(ids.lineWidth) as HTMLInputElement,
    mirrorMode: document.getElementById(ids.mirrorMode) as HTMLInputElement,
    messagesEnabled: document.getElementById(ids.messagesEnabled) as HTMLInputElement
  };
}

function applyForm(settings: MirrorFitSettings): void {
  const elements = getElements();
  elements.toggle.textContent = settings.enabled ? "Disable MirrorFit" : "Enable MirrorFit";
  elements.color.value = settings.color;
  elements.opacity.value = String(settings.opacity);
  elements.lineWidth.value = String(settings.lineWidth);
  elements.mirrorMode.checked = settings.mirrorMode;
  elements.messagesEnabled.checked = settings.messagesEnabled;
}

function readForm(settings: MirrorFitSettings): MirrorFitSettings {
  const elements = getElements();
  return {
    ...settings,
    color: elements.color.value,
    opacity: Number(elements.opacity.value),
    lineWidth: Number(elements.lineWidth.value),
    mirrorMode: elements.mirrorMode.checked,
    messagesEnabled: elements.messagesEnabled.checked
  };
}

async function sendSettings(settings: MirrorFitSettings): Promise<void> {
  const activeTabId = await getActiveTabId();
  if (!activeTabId) {
    return;
  }

  try {
    await chrome.tabs.sendMessage(activeTabId, {
      type: "MIRRORFIT_SETTINGS",
      payload: settings
    });
  } catch (error) {
    console.debug("MirrorFit could not reach the current tab", error);
  }
}

async function initPopup(): Promise<void> {
  let settings = { ...defaultSettings, ...(await getStoredSettings()) };
  applyForm(settings);

  const elements = getElements();

  const persist = async () => {
    settings = readForm(settings);
    await setStoredSettings(settings);
    await sendSettings(settings);
    applyForm(settings);
  };

  elements.toggle.addEventListener("click", async () => {
    settings = { ...settings, enabled: !settings.enabled };
    await setStoredSettings(settings);
    await sendSettings(settings);
    applyForm(settings);
  });

  elements.color.addEventListener("input", () => void persist());
  elements.opacity.addEventListener("input", () => void persist());
  elements.lineWidth.addEventListener("input", () => void persist());
  elements.mirrorMode.addEventListener("change", () => void persist());
  elements.messagesEnabled.addEventListener("change", () => void persist());
}

void initPopup();
