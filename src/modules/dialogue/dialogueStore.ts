import { create } from "zustand";
import { DialogueMessage } from "./types";

type DialogueStore = {
  selectedNpcId: string;
  messages: DialogueMessage[];
  setSelectedNpcId: (npcId: string) => void;
  pushMessage: (message: Omit<DialogueMessage, "id">) => void;
  clearMessages: () => void;
};

const seedMessage: DialogueMessage = {
  id: "seed-1",
  speaker: "system",
  text: "대화를 시작하면 여기에 기록이 쌓입니다."
};

export const useDialogueStore = create<DialogueStore>((set) => ({
  selectedNpcId: "mina",
  messages: [seedMessage],
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
      messages: [seedMessage]
    })
}));
