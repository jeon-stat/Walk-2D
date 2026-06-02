import { useEffect, useMemo, useState } from "react";
import { BottomTabs } from "./components/BottomTabs";
import { HomeScreen } from "./screens/HomeScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { CharacterScreen } from "./screens/CharacterScreen";
import { FriendsScreen } from "./screens/FriendsScreen";
import { useCharacterStore } from "./modules/character/characterStore";
import { useDialogueStore } from "./modules/dialogue/dialogueStore";
import { dialogueService } from "./modules/dialogue/dialogueService";
import { locationCatalog } from "./modules/location/locationCatalog";
import { useWorldStore } from "./modules/world/worldStore";
import { buildGameSnapshot, loadGameSnapshot, restoreGameSnapshot, saveGameSnapshot } from "./modules/save/saveService";
import "./styles/global.css";

const tabs = [
  { id: "home", label: "산책", icon: "🌤️" },
  { id: "history", label: "기록", icon: "📖" },
  { id: "character", label: "캐릭터", icon: "🐾" },
  { id: "friends", label: "친구", icon: "👥" }
] as const;

type TabId = (typeof tabs)[number]["id"];
type QuickAction = "talk" | "move" | "time" | "save" | "load";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [isReady, setIsReady] = useState(false);

  const character = useCharacterStore();
  const dialogue = useDialogueStore();
  const world = useWorldStore();

  useEffect(() => {
    const snapshot = loadGameSnapshot();
    if (snapshot) {
      restoreGameSnapshot(snapshot);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveGameSnapshot(buildGameSnapshot());
  }, [
    character.appearance,
    character.emotion,
    character.motion,
    dialogue.messages,
    dialogue.selectedNpcId,
    isReady,
    world.currentDateISO,
    world.events,
    world.locationId,
    world.minutesOfDay
  ]);

  const locationNames = useMemo(() => Object.values(locationCatalog), []);

  const handleAction = (actionId: QuickAction) => {
    if (actionId === "save") {
      world.logEvent({
        kind: "system",
        title: "저장",
        detail: "현재 상태를 저장했습니다."
      });
      saveGameSnapshot(buildGameSnapshot());
      return;
    }

    if (actionId === "load") {
      const snapshot = loadGameSnapshot();
      if (snapshot) {
        restoreGameSnapshot(snapshot);
      }
      world.logEvent({
        kind: "system",
        title: "불러오기",
        detail: "저장된 상태를 불러왔습니다."
      });
      return;
    }

    if (actionId === "talk") {
      const result = dialogueService.runSeedDialogue({
        npcId: dialogue.selectedNpcId,
        actionId: "talk"
      });
      dialogue.pushMessage({ speaker: "player", text: result.playerLine });
      dialogue.pushMessage({
        speaker: "npc",
        npcId: dialogue.selectedNpcId,
        text: result.npcLine,
        emotion: result.emotion
      });
      character.setEmotion(result.emotion);
      world.logEvent({
        kind: "dialogue",
        title: "대화",
        detail: `${dialogue.selectedNpcId}와 대화를 나눴습니다.`
      });
      return;
    }

    if (actionId === "move") {
      const currentIndex = locationNames.findIndex((location) => location.id === world.locationId);
      const nextLocation = locationNames[(currentIndex + 1) % locationNames.length] ?? locationNames[0];
      world.setLocation(nextLocation.id);
      return;
    }

    if (actionId === "time") {
      world.advanceTime(60);
    }
  };

  if (!isReady) {
    return (
      <div className="app-shell">
        <div className="boot-card">
          <p className="screen-kicker">Life Online</p>
          <h1>Walk-2D</h1>
          <p>불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Life Online 2D Edition</p>
          <h1>Walk-2D</h1>
          <p className="subtitle">
            기존 Life Online의 화면, 흐름, 데이터 구조를 유지하면서 캐릭터 렌더링만 2D 파츠 조합으로 바꾼 버전입니다.
          </p>
        </div>
        <div className="status-strip">
          <div>
            <span>현재 장소</span>
            <strong>{locationCatalog[world.locationId].name}</strong>
          </div>
          <div>
            <span>날짜</span>
            <strong>{world.currentDateLabel}</strong>
          </div>
          <div>
            <span>시간</span>
            <strong>{world.currentTimeLabel}</strong>
          </div>
        </div>
      </header>

      <main className="app-content">
        {activeTab === "home" ? <HomeScreen onAction={handleAction} /> : null}
        {activeTab === "history" ? <HistoryScreen /> : null}
        {activeTab === "character" ? <CharacterScreen /> : null}
        {activeTab === "friends" ? <FriendsScreen /> : null}
      </main>

      <BottomTabs
        items={tabs.map((tab) => ({ ...tab }))}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
      />
    </div>
  );
}
