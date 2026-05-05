export type MirrorFitSettings = {
  enabled: boolean;
  color: string;
  opacity: number;
  lineWidth: number;
  mirrorMode: boolean;
  messagesEnabled: boolean;
};

export type PosePoint = {
  x: number;
  y: number;
  confidence: number;
};

export type PoseFrame = {
  points: PosePoint[];
  timestamp: number;
};

export type MirrorFitMessage =
  | { type: "MIRRORFIT_GET_SETTINGS" }
  | { type: "MIRRORFIT_SETTINGS"; payload: MirrorFitSettings }
  | { type: "MIRRORFIT_TOGGLE" };
