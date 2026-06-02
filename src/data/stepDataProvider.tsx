import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { SKIN_TONE_PRESETS } from "../characters";
import { DEFAULT_STEP_GOAL } from "../game/stepRules";
import { createMockStepSnapshot } from "./mockStepData";
import type { LongTermState } from "../constants/theme";

type StepRecord = {
  id: string;
  date: string;
  steps: number;
  source: string;
};

type AdminState = {
  visible: boolean;
  canOverride: boolean;
  source: string;
  forcedEnergyLevel: number | null;
  forcedLongTermState: LongTermState | null;
  forcedSpecialActionKey: string | null;
  skinTones: ReadonlyArray<(typeof SKIN_TONE_PRESETS)[number]>;
  skinToneId: string | null;
  setSkinTone: (nextSkinToneId: string | null) => void;
  toggleVisible: () => void;
  show: () => void;
  hide: () => void;
  setForcedEnergyLevel: (nextLevel: number | null) => void;
  setForcedLongTermState: (nextState: string | null) => void;
  setForcedSpecialActionKey: (nextKey: string | null) => void;
  resetBehavior: () => void;
  resetMock: () => void;
};

type StepDataContextValue = {
  mode: string;
  goal: number;
  today: StepRecord;
  history: StepRecord[];
  admin: AdminState;
};

const StepDataContext = createContext<StepDataContextValue | null>(null);

export function StepDataProvider({
  children,
  mode = "mock",
  adminEnabled = false,
}: {
  children: ReactNode;
  mode?: string;
  adminEnabled?: boolean;
}) {
  const [mockState, setMockState] = useState(() => createMockStepSnapshot());
  const [skinToneId, setSkinToneId] = useState<string | null>(SKIN_TONE_PRESETS[0]?.id ?? null);
  const [adminVisible, setAdminVisible] = useState(() => Boolean(adminEnabled));
  const [behaviorAdmin, setBehaviorAdmin] = useState<{
    forcedEnergyLevel: number | null;
    forcedLongTermState: LongTermState | null;
    forcedSpecialActionKey: string | null;
  }>({
    forcedEnergyLevel: null,
    forcedLongTermState: null,
    forcedSpecialActionKey: null,
  });

  const isMockMode = mode === "mock";
  const history = isMockMode ? mockState.history : [];
  const today = history[0] ?? {
    id: "today",
    date: new Date().toISOString().slice(0, 10),
    steps: 0,
    source: isMockMode ? "mock" : "device",
  };

  const value = useMemo<StepDataContextValue>(
    () => ({
      mode,
      goal: DEFAULT_STEP_GOAL,
      today,
      history,
      admin: {
        visible: adminVisible,
        canOverride: Boolean(adminEnabled && isMockMode),
        source: today.source,
        ...behaviorAdmin,
        skinTones: SKIN_TONE_PRESETS,
        skinToneId,
        setSkinTone: (nextSkinToneId) => {
          if (!adminEnabled) return;
          setSkinToneId(nextSkinToneId);
        },
        toggleVisible: () => {
          if (!adminEnabled) return;
          setAdminVisible((current) => !current);
        },
        show: () => {
          if (!adminEnabled) return;
          setAdminVisible(true);
        },
        hide: () => {
          if (!adminEnabled) return;
          setAdminVisible(false);
        },
        setForcedEnergyLevel: (nextLevel) => {
          if (!adminEnabled) return;
          setBehaviorAdmin((current) => ({
            ...current,
            forcedEnergyLevel: nextLevel === null ? null : clampNumber(nextLevel, 0, 6),
          }));
        },
        setForcedLongTermState: (nextState) => {
          if (!adminEnabled) return;
          setBehaviorAdmin((current) => ({ ...current, forcedLongTermState: nextState as LongTermState | null }));
        },
        setForcedSpecialActionKey: (nextKey) => {
          if (!adminEnabled) return;
          setBehaviorAdmin((current) => ({
            ...current,
            forcedSpecialActionKey: normalizeSpecialActionKey(nextKey),
          }));
        },
        resetBehavior: () => {
          if (!adminEnabled) return;
          setBehaviorAdmin({
            forcedEnergyLevel: null,
            forcedLongTermState: null,
            forcedSpecialActionKey: null,
          });
        },
        resetMock: () => {
          if (!adminEnabled || !isMockMode) return;
          setMockState(createMockStepSnapshot());
        },
      },
    }),
    [adminEnabled, adminVisible, behaviorAdmin, history, isMockMode, mode, skinToneId, today],
  );

  return <StepDataContext.Provider value={value}>{children}</StepDataContext.Provider>;
}

function clampNumber(value: number, min: number, max: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.max(min, Math.min(max, numeric));
}

function normalizeSpecialActionKey(value: string | null) {
  if (value === null) return null;

  const key = String(value);
  if (key === "hipHopDancing") {
    return key;
  }

  return null;
}

export function useStepData() {
  const context = useContext(StepDataContext);
  if (!context) {
    throw new Error("useStepData must be used inside StepDataProvider");
  }
  return context;
}
