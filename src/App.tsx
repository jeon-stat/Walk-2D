import { useEffect, useMemo, useState } from "react";
import { CharacterViewer } from "./modules/character/components/CharacterViewer";
import { CharacterControls } from "./modules/character/components/CharacterControls";
import { useCharacterStore } from "./modules/character/characterStore";
import { useDialogueStore } from "./modules/dialogue/dialogueStore";
import {
  buildGameSnapshot,
  loadGameSnapshot,
  restoreGameSnapshot,
  saveGameSnapshot
} from "./modules/save/saveService";
import { useWorldStore } from "./modules/world/worldStore";
import { useInventoryStore } from "./modules/inventory/inventoryStore";
import { useRelationshipStore } from "./modules/relationship/relationshipStore";
import { useQuestStore } from "./modules/quest/questStore";
import { locationCatalog } from "./modules/location/locationCatalog";
import { timePeriodLabel } from "./modules/time/timeUtils";
import { dialogueService } from "./modules/dialogue/dialogueService";
import { npcCatalog } from "./modules/dialogue/mockDialogues";

const actionButtons = [
  { id: "talk", label: "대화" },
  { id: "gift", label: "선물" },
  { id: "ask", label: "질문" },
  { id: "quest", label: "퀘스트 진행" },
  { id: "save", label: "저장" },
  { id: "load", label: "불러오기" }
] as const;

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const character = useCharacterStore();
  const world = useWorldStore();
  const dialogue = useDialogueStore();
  const inventory = useInventoryStore();
  const relationships = useRelationshipStore();
  const quests = useQuestStore();

  useEffect(() => {
    const snapshot = loadGameSnapshot();
    if (snapshot) {
      restoreGameSnapshot(snapshot);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    saveGameSnapshot(buildGameSnapshot());
  }, [
    character.appearance,
    character.emotion,
    character.motion,
    dialogue.messages,
    dialogue.selectedNpcId,
    inventory.items,
    isLoaded,
    quests.quests,
    relationships.npcs,
    world.currentDateISO,
    world.locationId,
    world.minutesOfDay
  ]);

  const currentLocation = locationCatalog[world.locationId];
  const currentNpc = npcCatalog[dialogue.selectedNpcId];
  const timeLabel = timePeriodLabel(world.minutesOfDay);

  const summaryItems = useMemo(
    () => ({
      inventory: inventory.items.slice(0, 3),
      relationships: relationships.npcs.slice(0, 2),
      quests: quests.quests.slice(0, 2)
    }),
    [inventory.items, quests.quests, relationships.npcs]
  );

  const handleAction = (actionId: string) => {
    if (actionId === "save") {
      saveGameSnapshot(buildGameSnapshot());
      return;
    }

    if (actionId === "load") {
      const snapshot = loadGameSnapshot();
      if (snapshot) {
        restoreGameSnapshot(snapshot);
      }
      return;
    }

    const result = dialogueService.runMockDialogue({
      npcId: dialogue.selectedNpcId,
      actionId
    });

    dialogue.pushMessage({
      speaker: "player",
      text: result.playerLine
    });

    dialogue.pushMessage({
      speaker: "npc",
      npcId: dialogue.selectedNpcId,
      text: result.npcLine,
      emotion: result.emotion
    });

    character.setEmotion(result.emotion);
    relationships.adjustAffinity(dialogue.selectedNpcId, result.affinityDelta);
    if (result.questProgressDelta > 0) {
      quests.advanceQuest("intro-quest", result.questProgressDelta);
    }
  };

  const handleDialoguePrompt = (npcId: string) => {
    dialogue.setSelectedNpcId(npcId);
    const greeting = dialogueService.getGreeting(npcId);
    dialogue.pushMessage({
      speaker: "system",
      text: greeting.systemLine
    });
    dialogue.pushMessage({
      speaker: "npc",
      npcId,
      text: greeting.npcLine,
      emotion: greeting.emotion
    });
    character.setEmotion(greeting.emotion);
  };

  if (!isLoaded) {
    return <div className="app-shell">Loading...</div>;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Life Online 2D Edition</p>
          <h1>Walk 2D</h1>
          <p className="subtitle">
            Life Online의 핵심 구조를 이어갈 수 있는 2D 파츠 기반 시작점입니다.
          </p>
        </div>
        <div className="status-strip">
          <div>
            <span>현재 장소</span>
            <strong>{currentLocation.name}</strong>
          </div>
          <div>
            <span>날짜</span>
            <strong>{world.currentDateLabel}</strong>
          </div>
          <div>
            <span>시간대</span>
            <strong>{timeLabel}</strong>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <section className="panel hero-panel">
          <div className="panel-head">
            <h2>캐릭터</h2>
            <span>{character.emotion} / {character.motion}</span>
          </div>
          <CharacterViewer />
          <CharacterControls />
        </section>

        <section className="panel world-panel">
          <div className="panel-head">
            <h2>세계 상태</h2>
            <span>핵심 모듈 연결 상태</span>
          </div>
          <div className="section-grid">
            <div className="card">
              <h3>장소 이동</h3>
              <div className="button-grid">
                {Object.values(locationCatalog).map((location) => (
                  <button
                    key={location.id}
                    className={location.id === world.locationId ? "button active" : "button"}
                    onClick={() => world.setLocation(location.id)}
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>시간 흐름</h3>
              <p>{world.currentDateLabel}</p>
              <p>
                {world.currentTimeLabel} · {timeLabel}
              </p>
              <div className="button-grid">
                <button className="button" onClick={() => world.advanceTime(60)}>
                  1시간 진행
                </button>
                <button className="button" onClick={() => world.advanceTime(240)}>
                  4시간 진행
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="panel dialogue-panel">
          <div className="panel-head">
            <h2>대화창</h2>
            <span>Mock dialogue service</span>
          </div>
          <div className="dialogue-meta">
            <div>
              <strong>대상 NPC</strong>
              <p>{currentNpc.name}</p>
            </div>
            <div>
              <strong>선택된 표정</strong>
              <p>{character.emotion}</p>
            </div>
          </div>
          <div className="dialogue-log">
            {dialogue.messages.slice(-6).map((message) => (
              <div key={message.id} className={`bubble ${message.speaker}`}>
                <span className="bubble-label">
                  {message.speaker === "player"
                    ? "나"
                    : message.speaker === "npc"
                      ? npcCatalog[message.npcId ?? dialogue.selectedNpcId].name
                      : "System"}
                </span>
                <p>{message.text}</p>
                {message.emotion ? <small>{message.emotion}</small> : null}
              </div>
            ))}
          </div>
          <div className="button-grid action-grid">
            {actionButtons.map((action) => (
              <button key={action.id} className="button" onClick={() => handleAction(action.id)}>
                {action.label}
              </button>
            ))}
          </div>
          <div className="button-grid npc-grid">
            {Object.values(npcCatalog).map((npc) => (
              <button key={npc.id} className="button subtle" onClick={() => handleDialoguePrompt(npc.id)}>
                {npc.name}
              </button>
            ))}
          </div>
        </section>

        <section className="panel summary-panel">
          <div className="panel-head">
            <h2>인벤토리</h2>
            <span>{inventory.items.length} items</span>
          </div>
          <ul className="summary-list">
            {summaryItems.inventory.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong>
                <span>{item.quantity}개 · {item.description}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel summary-panel">
          <div className="panel-head">
            <h2>관계도</h2>
            <span>{relationships.npcs.length} NPCs</span>
          </div>
          <ul className="summary-list">
            {summaryItems.relationships.map((npc) => (
              <li key={npc.id}>
                <strong>{npc.name}</strong>
                <span>
                  호감도 {npc.affinity} · {npc.title}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel summary-panel">
          <div className="panel-head">
            <h2>퀘스트</h2>
            <span>{quests.quests.length} quests</span>
          </div>
          <ul className="summary-list">
            {summaryItems.quests.map((quest) => (
              <li key={quest.id}>
                <strong>{quest.title}</strong>
                <span>
                  {quest.progress}/{quest.goal} · {quest.statusLabel}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
