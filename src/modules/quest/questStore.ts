import { create } from "zustand";

export type QuestRecord = {
  id: string;
  title: string;
  progress: number;
  goal: number;
  statusLabel: string;
};

type QuestStore = {
  quests: QuestRecord[];
  advanceQuest: (questId: string, amount: number) => void;
};

const initialQuests: QuestRecord[] = [
  {
    id: "intro-quest",
    title: "처음 만난 사람과 친해지기",
    progress: 1,
    goal: 5,
    statusLabel: "진행 중"
  }
];

export const useQuestStore = create<QuestStore>((set) => ({
  quests: initialQuests,
  advanceQuest: (questId, amount) =>
    set((state) => ({
      quests: state.quests.map((quest) => {
        if (quest.id !== questId) {
          return quest;
        }
        const progress = Math.min(quest.goal, quest.progress + amount);
        return {
          ...quest,
          progress,
          statusLabel: progress >= quest.goal ? "완료" : "진행 중"
        };
      })
    }))
}));
