import { useEffect, useMemo, useState } from "react";

import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { AdminPanel } from "./components/AdminPanel";
import { BottomTabs } from "./components/BottomTabs";
import { AuthScreen } from "./screens/AuthScreen";
import { CharacterScreen } from "./screens/CharacterScreen";
import { FriendsScreen } from "./screens/FriendsScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { StepDataProvider, useStepData } from "./data/stepDataProvider";
import { buildCharacterViewModel } from "./game/characterState";
import "./styles/global.css";

const TABS = [
  { id: "home", label: "산책", icon: "🌤️" },
  { id: "history", label: "발자국", icon: "📖" },
  { id: "character", label: "캐릭터", icon: "🐾" },
  { id: "friends", label: "친구", icon: "👥" },
];

const STEP_DATA_MODE = "mock";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const { isAuthenticated } = useAuth();
  const adminEnabled = useMemo(() => {
    if ((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV) {
      return true;
    }

    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("dev") === "1";
    }

    return false;
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="app-root">
        <AuthScreen />
      </div>
    );
  }

  return (
    <StepDataProvider mode={STEP_DATA_MODE} adminEnabled={adminEnabled}>
      <AppShell activeTab={activeTab} onChangeTab={setActiveTab} />
    </StepDataProvider>
  );
}

function AppShell({ activeTab, onChangeTab }: { activeTab: string; onChangeTab: (tab: string) => void }) {
  const { today, history, goal, admin } = useStepData();
  const viewState = useMemo(
    () => buildCharacterViewModel({ todayRecord: today, history, goal, admin }),
    [admin, goal, history, today],
  );

  return (
    <div className="app-root app-shell">
      <div className="screen-area">
        {activeTab === "home" ? <HomeScreen /> : null}
        {activeTab === "history" ? <HistoryScreen /> : null}
        {activeTab === "character" ? <CharacterScreen /> : null}
        {activeTab === "friends" ? <FriendsScreen /> : null}
      </div>

      {admin?.visible && admin?.canOverride ? (
        <div className="admin-panel-overlay">
          <div className="admin-panel-scroll">
            <AdminPanel admin={admin} behavior={viewState.behavior} />
          </div>
        </div>
      ) : null}

      {admin?.visible ? (
        <button type="button" onClick={admin.toggleVisible} className="admin-toggle">
          Hide Admin
        </button>
      ) : admin?.canOverride ? (
        <button type="button" onClick={admin.toggleVisible} className="admin-toggle">
          Show Admin
        </button>
      ) : null}

      <BottomTabs items={TABS} activeId={activeTab} onChange={onChangeTab} />
    </div>
  );
}
