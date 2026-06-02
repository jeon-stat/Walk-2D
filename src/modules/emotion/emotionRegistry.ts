import { CharacterEmotion } from "../character/types";

export const emotionLabels: Record<CharacterEmotion, string> = {
  normal: "Normal",
  happy: "Happy",
  sad: "Sad",
  angry: "Angry",
  surprised: "Surprised",
  sleepy: "Sleepy"
};

export const emotionDescriptions: Record<CharacterEmotion, string> = {
  normal: "Baseline facial state for calm interactions.",
  happy: "Used for friendly dialogue and positive reactions.",
  sad: "Used when the character feels disappointed or low-energy.",
  angry: "Used for tense or frustrated reactions.",
  surprised: "Used for unexpected events and sudden changes.",
  sleepy: "Used for quiet, low-energy moments."
};
