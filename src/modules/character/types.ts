export const characterParts = [
  "body",
  "hair",
  "eyes",
  "mouth",
  "top",
  "bottom",
  "shoes",
  "accessory"
] as const;

export type CharacterPart = (typeof characterParts)[number];

export const emotions = [
  "normal",
  "happy",
  "sad",
  "angry",
  "surprised",
  "sleepy"
] as const;

export type CharacterEmotion = (typeof emotions)[number];

export const motions = ["idle", "walk", "run"] as const;
export type CharacterMotion = (typeof motions)[number];

export type CharacterAppearance = Record<CharacterPart, string>;

export type CharacterFrame = {
  offsetY: number;
  scaleY: number;
  scaleX: number;
  rotate: number;
};
