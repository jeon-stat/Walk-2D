import { create } from "zustand";
import { DialogueMessage } from "./types";

type DialogueStore = {
  selectedNpcId: string;
  messages: DialogueMessage[];
  setSelectedNpcId: (npcId: string) => void;
  pushMessage: (message: Omit<DialogueMessage, "id">) => void;
  clearMessages: () => void;
};

export const useDialogueStore = create<DialogueStore>((set) => ({
  selectedNpcId: "mina",
  messages: [
    {
      id: "seed-1",
      speaker: "system",
      text: "대화를 시작하면 mock 응답이 여기에 쌓입니다."
    }
  ],
  setSelectedNpcId: (npcId) => set({ selectedNpcId: npcId }),
  pushMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID()
        }
      ]
    })),
  clearMessages: () =>
    set({
      messages: [
        {
          id: "seed-1",
          speaker: "system",
          text: "대화를 시작하면 mock 응답이 여기에 쌓입니다."
        }
      ]
    })
}));
