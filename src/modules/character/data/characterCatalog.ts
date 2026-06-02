import { CharacterAppearance, CharacterEmotion, CharacterPart } from "../types";

export type PartOption = {
  id: string;
  label: string;
  tint: string;
};

export const defaultCharacterAppearance: CharacterAppearance = {
  body: "default",
  hair: "short",
  eyes: "calm",
  mouth: "smile",
  top: "hoodie",
  bottom: "pants",
  shoes: "sneakers",
  accessory: "none"
};

export const partOptions: Record<CharacterPart, PartOption[]> = {
  body: [
    { id: "default", label: "기본 바디", tint: "#f1c7a9" },
    { id: "warm", label: "따뜻한 톤", tint: "#f0b89e" },
    { id: "cool", label: "쿨톤", tint: "#d8d7ff" }
  ],
  hair: [
    { id: "short", label: "숏컷", tint: "#1d2438" },
    { id: "long", label: "롱헤어", tint: "#4f3828" },
    { id: "twintail", label: "트윈테일", tint: "#7b4f2f" }
  ],
  eyes: [
    { id: "calm", label: "차분", tint: "#182135" },
    { id: "bright", label: "반짝", tint: "#23467a" },
    { id: "soft", label: "부드러움", tint: "#47547a" }
  ],
  mouth: [
    { id: "smile", label: "미소", tint: "#8e4156" },
    { id: "talk", label: "말풍선", tint: "#ae5677" },
    { id: "small", label: "작은 입", tint: "#7b3448" }
  ],
  top: [
    { id: "hoodie", label: "후드", tint: "#3d6cff" },
    { id: "shirt", label: "셔츠", tint: "#5b7cda" },
    { id: "jacket", label: "재킷", tint: "#2b3f74" }
  ],
  bottom: [
    { id: "pants", label: "팬츠", tint: "#304870" },
    { id: "skirt", label: "스커트", tint: "#6b4d8f" },
    { id: "shorts", label: "반바지", tint: "#516b8f" }
  ],
  shoes: [
    { id: "sneakers", label: "운동화", tint: "#ffffff" },
    { id: "boots", label: "부츠", tint: "#c08a5d" },
    { id: "sandals", label: "샌들", tint: "#d2d0ff" }
  ],
  accessory: [
    { id: "none", label: "없음", tint: "#ffffff" },
    { id: "glasses", label: "안경", tint: "#cfe2ff" },
    { id: "hairpin", label: "헤어핀", tint: "#ff92b9" }
  ]
};

export const emotionFaceMap: Record<
  CharacterEmotion,
  { eyes: string; mouth: string }
> = {
  normal: { eyes: "calm", mouth: "smile" },
  happy: { eyes: "bright", mouth: "smile" },
  sad: { eyes: "soft", mouth: "small" },
  angry: { eyes: "calm", mouth: "talk" },
  surprised: { eyes: "bright", mouth: "talk" },
  sleepy: { eyes: "soft", mouth: "small" }
};
