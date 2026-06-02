import { create } from "zustand";
import { CharacterAppearance, CharacterEmotion, CharacterMotion } from "./types";
import { defaultCharacterAppearance } from "./data/characterCatalog";

type CharacterStore = {
  appearance: CharacterAppearance;
  emotion: CharacterEmotion;
  motion: CharacterMotion;
  setPart: (part: keyof CharacterAppearance, variantId: string) => void;
  setEmotion: (emotion: CharacterEmotion) => void;
  setMotion: (motion: CharacterMotion) => void;
  resetCharacter: () => void;
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  appearance: defaultCharacterAppearance,
  emotion: "normal",
  motion: "idle",
  setPart: (part, variantId) =>
    set((state) => ({
      appearance: {
        ...state.appearance,
        [part]: variantId
      }
    })),
  setEmotion: (emotion) => set({ emotion }),
  setMotion: (motion) => set({ motion }),
  resetCharacter: () =>
    set({
      appearance: defaultCharacterAppearance,
      emotion: "normal",
      motion: "idle"
    })
}));
