import { CharacterEmotion } from "../character/types";

export type DialogueSpeaker = "system" | "player" | "npc";

export type DialogueMessage = {
  id: string;
  speaker: DialogueSpeaker;
  text: string;
  npcId?: string;
  emotion?: CharacterEmotion;
};

export type DialogueActionId = "talk" | "gift" | "ask" | "quest";

export type DialogueResult = {
  playerLine: string;
  npcLine: string;
  emotion: CharacterEmotion;
  affinityDelta: number;
  questProgressDelta: number;
};
