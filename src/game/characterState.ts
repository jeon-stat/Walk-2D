import { theme } from "../constants/theme";
import { buildBehaviorProfile } from "./behavior";
import { getMemories } from "./memories";
import { getPersonality } from "./personality";
import { getGrowthProgress } from "./progression";
import { DEFAULT_STEP_GOAL, getStepProgress } from "./stepRules";
import type { EnergyState, LongTermState } from "../constants/theme";

export function buildCharacterViewModel({
  todayRecord,
  history,
  goal = DEFAULT_STEP_GOAL,
  admin = null,
}: {
  todayRecord?: { steps?: number; source?: string } | null;
  history: Array<{ steps: number; date?: string; source?: string; walkPeriod?: string; period?: string; dayPart?: string }>;
  goal?: number;
  admin?: {
    forcedEnergyLevel?: number | null;
    forcedLongTermState?: LongTermState | null;
    forcedSpecialActionKey?: string | null;
    visible?: boolean;
  } | null;
}) {
  const steps = todayRecord?.steps ?? 0;
  const behavior = buildBehaviorProfile({
    steps,
    history,
    goal,
    overrides: {
      forceEnergyLevel: admin?.forcedEnergyLevel ?? null,
      forceLongTermState: admin?.forcedLongTermState ?? null,
      forceSpecialActionKey: admin?.forcedSpecialActionKey ?? null,
    },
  });
  const energyTheme = theme.status[behavior.backgroundState as EnergyState] ?? theme.status.NORMAL_ENERGY;
  const growthTheme = theme.growth[behavior.longTermState as LongTermState];
  const progress = getStepProgress(steps, goal);
  const progressPercent = Math.round(progress * 100);
  const growth = getGrowthProgress(history.map((record) => ({ steps: record.steps })), goal);
  const personality = getPersonality(history, goal);
  const memories = getMemories(history, goal);

  return {
    steps,
    goal,
    status: behavior.energyState,
    energyState: behavior.energyState,
    energyLevel: behavior.energyLevel,
    longTermState: behavior.longTermState,
    backgroundState: behavior.backgroundState,
    growthLabel: growthTheme.label,
    growthDescription: growthTheme.description,
    statusLabel: energyTheme.label,
    bubbleText: energyTheme.bubble,
    statusDescription: energyTheme.description,
    background: energyTheme.background,
    sceneBackground: energyTheme.background[0],
    stageColor: energyTheme.stage,
    bubbleSurface: energyTheme.bubbleSurface,
    effect: energyTheme.effect,
    animationSpeed: energyTheme.animationSpeed,
    bobAmount: energyTheme.bobAmount,
    animationState: behavior.animationState,
    animationClip: behavior.animationClip,
    currentAction: behavior.currentAction,
    behavior,
    debugVisible: Boolean(admin?.visible),
    progress,
    progressPercent,
    streak: growth.streak,
    reachedGoal: steps >= goal,
    source: todayRecord?.source ?? "mock",
    totalXp: growth.xp,
    level: growth.level,
    xpIntoLevel: growth.xpIntoLevel,
    xpToNext: growth.nextLevelXp,
    levelProgress: growth.levelProgress,
    growth,
    personality,
    memories,
  };
}
