import { CharacterEmotion } from "../character/types";
import { DialogueActionId, DialogueResult } from "./types";
import { dialoguePresets, npcCatalog } from "./dialogueSeed";

export const dialogueService = {
  getGreeting(npcId: string) {
    return (
      dialoguePresets[npcId]?.greeting ?? {
        systemLine: "알 수 없는 NPC가 응답했습니다.",
        npcLine: "안녕. 편하게 말을 걸어도 좋아.",
        emotion: "normal" as CharacterEmotion
      }
    );
  },

  runSeedDialogue({
    npcId,
    actionId
  }: {
    npcId: string;
    actionId: string;
  }): DialogueResult {
    const preset = dialoguePresets[npcId] ?? dialoguePresets.mina;
    const action = preset.actions[actionId as DialogueActionId] ?? preset.actions.talk;
    const npcName = npcCatalog[npcId]?.name ?? "NPC";

    return {
      playerLine: action.playerLine,
      npcLine: `${npcName}: ${action.npcLine}`,
      emotion: action.emotion,
      affinityDelta: action.affinityDelta,
      questProgressDelta: action.questProgressDelta
    };
  }
};
