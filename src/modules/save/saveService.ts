import { useCharacterStore } from "../character/characterStore";
import { useDialogueStore } from "../dialogue/dialogueStore";
import { useInventoryStore } from "../inventory/inventoryStore";
import { useQuestStore } from "../quest/questStore";
import { useRelationshipStore } from "../relationship/relationshipStore";
import { useWorldStore, WorldEvent } from "../world/worldStore";
import { CharacterAppearance, CharacterEmotion, CharacterMotion } from "../character/types";
import { DialogueMessage } from "../dialogue/types";
import { getCurrentTimeLabel, getDateLabel } from "../time/timeUtils";

const STORAGE_KEY = "walk-2d-save-v1";

export type CharacterSaveData = {
  appearance: CharacterAppearance;
  emotion: CharacterEmotion;
  motion: CharacterMotion;
};

export type DialogueSaveData = {
  selectedNpcId: string;
  messages: DialogueMessage[];
};

export type InventorySaveData = {
  items: ReturnType<typeof useInventoryStore.getState>["items"];
};

export type RelationshipSaveData = {
  npcs: ReturnType<typeof useRelationshipStore.getState>["npcs"];
};

export type QuestSaveData = {
  quests: ReturnType<typeof useQuestStore.getState>["quests"];
};

export type WorldSaveData = {
  locationId: ReturnType<typeof useWorldStore.getState>["locationId"];
  currentDateISO: string;
  minutesOfDay: number;
  events: WorldEvent[];
};

export type GameSnapshot = {
  character: CharacterSaveData;
  dialogue: DialogueSaveData;
  inventory: InventorySaveData;
  relationships: RelationshipSaveData;
  quests: QuestSaveData;
  world: WorldSaveData;
};

export function buildGameSnapshot(): GameSnapshot {
  const character = useCharacterStore.getState();
  const dialogue = useDialogueStore.getState();
  const inventory = useInventoryStore.getState();
  const relationships = useRelationshipStore.getState();
  const quests = useQuestStore.getState();
  const world = useWorldStore.getState();

  return {
    character: {
      appearance: character.appearance,
      emotion: character.emotion,
      motion: character.motion
    },
    dialogue: {
      selectedNpcId: dialogue.selectedNpcId,
      messages: dialogue.messages
    },
    inventory: {
      items: inventory.items
    },
    relationships: {
      npcs: relationships.npcs
    },
    quests: {
      quests: quests.quests
    },
    world: {
      locationId: world.locationId,
      currentDateISO: world.currentDateISO,
      minutesOfDay: world.minutesOfDay,
      events: world.events
    }
  };
}

export function saveGameSnapshot(snapshot: GameSnapshot) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function loadGameSnapshot(): GameSnapshot | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as GameSnapshot;
  } catch {
    return null;
  }
}

export function restoreGameSnapshot(snapshot: GameSnapshot) {
  useCharacterStore.setState(snapshot.character);
  useDialogueStore.setState({
    selectedNpcId: snapshot.dialogue.selectedNpcId,
    messages: snapshot.dialogue.messages
  });
  useInventoryStore.setState(snapshot.inventory);
  useRelationshipStore.setState(snapshot.relationships);
  useQuestStore.setState(snapshot.quests);
  useWorldStore.setState({
    locationId: snapshot.world.locationId,
    currentDateISO: snapshot.world.currentDateISO,
    minutesOfDay: snapshot.world.minutesOfDay,
    events: snapshot.world.events ?? [],
    currentDateLabel: getDateLabel(snapshot.world.currentDateISO),
    currentTimeLabel: getCurrentTimeLabel(snapshot.world.minutesOfDay),
    setLocation: useWorldStore.getState().setLocation,
    advanceTime: useWorldStore.getState().advanceTime,
    logEvent: useWorldStore.getState().logEvent,
    clearEvents: useWorldStore.getState().clearEvents
  });
}
