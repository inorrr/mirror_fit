import type { MirrorFitSettings } from "./types";

export const defaultSettings: MirrorFitSettings = {
  enabled: false,
  color: "#39ff88",
  opacity: 0.85,
  lineWidth: 4,
  mirrorMode: true,
  messagesEnabled: true
};

export const SETTINGS_KEY = "mirrorfit:settings";

export async function getStoredSettings(): Promise<MirrorFitSettings> {
  const result = await chrome.storage.sync.get(SETTINGS_KEY);
  return { ...defaultSettings, ...(result[SETTINGS_KEY] ?? {}) };
}

export async function setStoredSettings(settings: MirrorFitSettings): Promise<void> {
  await chrome.storage.sync.set({ [SETTINGS_KEY]: settings });
}
