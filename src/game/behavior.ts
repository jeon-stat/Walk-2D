import { DEFAULT_STEP_GOAL, getEnergyLevel as getEnergyLevelFromSteps, getStepRatio } from "./stepRules";
import { getGrowthProgress } from "./progression";

export const ENERGY_STATES = {
  LOW_ENERGY: "LOW_ENERGY",
  NORMAL_ENERGY: "NORMAL_ENERGY",
  HIGH_ENERGY: "HIGH_ENERGY",
} as const;

export const LONG_TERM_STATES = {
  WEAK: "WEAK",
  HEALTHY: "HEALTHY",
  ACTIVE: "ACTIVE",
} as const;

export const ACTION_TYPES = {
  MAIN: "main",
  SPECIAL: "special",
} as const;

export const ACTION_KEYS = {
  energy0: "energy0",
  energy1: "energy1",
  energy2: "energy2",
  energy3: "energy3",
  energy4: "energy4",
  energy5: "energy5",
  energy6: "energy6",
  hipHopDancing: "hipHopDancing",
  moonwalk: "moonwalk",
} as const;

export const ACTION_LABELS: Record<string, string> = {
  energy0: "Sitting Idle",
  energy1: "Yawn",
  energy2: "Breathing Idle",
  energy3: "Neutral Idle",
  energy4: "Walking",
  energy5: "Running",
  energy6: "Special",
  hipHopDancing: "Hip Hop Dancing",
  moonwalk: "Moonwalk",
};

const ENERGY_LEVEL_TO_STATE = [
  ACTION_KEYS.energy0,
  ACTION_KEYS.energy1,
  ACTION_KEYS.energy2,
  ACTION_KEYS.energy3,
  ACTION_KEYS.energy4,
  ACTION_KEYS.energy5,
  ACTION_KEYS.energy6,
] as const;

const ENERGY_LEVEL_TO_CLIP: Record<string, string> = {
  [ACTION_KEYS.energy0]: "sitting-idle",
  [ACTION_KEYS.energy1]: "yawn",
  [ACTION_KEYS.energy2]: "breathing-idle",
  [ACTION_KEYS.energy3]: "neutral-idle",
  [ACTION_KEYS.energy4]: "walking",
  [ACTION_KEYS.energy5]: "running",
  [ACTION_KEYS.energy6]: "hip-hop-dancing",
  [ACTION_KEYS.hipHopDancing]: "hip-hop-dancing",
  [ACTION_KEYS.moonwalk]: "moonwalk",
};

const ENERGY_LEVEL_TO_ANIMATION_SPEED: Record<string, number> = {
  [ACTION_KEYS.energy0]: 0.96,
  [ACTION_KEYS.energy1]: 0.98,
  [ACTION_KEYS.energy2]: 1.0,
  [ACTION_KEYS.energy3]: 1.0,
  [ACTION_KEYS.energy4]: 1.02,
  [ACTION_KEYS.energy5]: 1.08,
  [ACTION_KEYS.energy6]: 1.0,
  [ACTION_KEYS.hipHopDancing]: 1.0,
  [ACTION_KEYS.moonwalk]: 1.0,
};

type Action = {
  key: string;
  label: string;
  type: string;
  clipKey: string;
  available: boolean;
  baseWeight: number;
  clipSpeed: number;
  worldSpeed: number;
  motionKind: string;
  weight?: number;
};

function createAction(input: Action) {
  return input;
}

function getMotionKindForEnergyKey(key: string) {
  switch (key) {
    case ACTION_KEYS.energy0:
    case ACTION_KEYS.energy1:
    case ACTION_KEYS.energy2:
    case ACTION_KEYS.energy3:
      return "neutral";
    case ACTION_KEYS.energy4:
      return "walk";
    case ACTION_KEYS.energy5:
      return "run";
    case ACTION_KEYS.energy6:
      return "neutral";
    default:
      return "neutral";
  }
}

function getWorldSpeedForEnergyKey(key: string) {
  switch (key) {
    case ACTION_KEYS.energy0:
      return 0.0;
    case ACTION_KEYS.energy1:
      return 0.0;
    case ACTION_KEYS.energy2:
      return 0.0;
    case ACTION_KEYS.energy3:
      return 0.02;
    case ACTION_KEYS.energy4:
      return 0.14;
    case ACTION_KEYS.energy5:
      return 0.26;
    case ACTION_KEYS.energy6:
      return 0.04;
    default:
      return 0.0;
  }
}

const MAIN_ACTION_LIBRARY = ENERGY_LEVEL_TO_STATE.map((key) =>
  createAction({
    key,
    label: ACTION_LABELS[key],
    type: ACTION_TYPES.MAIN,
    clipKey: ENERGY_LEVEL_TO_CLIP[key],
    available: true,
    baseWeight: 1,
    clipSpeed: ENERGY_LEVEL_TO_ANIMATION_SPEED[key],
    worldSpeed: getWorldSpeedForEnergyKey(key),
    motionKind: getMotionKindForEnergyKey(key),
  }),
);

const SPECIAL_ACTION_LIBRARY = [
  createAction({
    key: ACTION_KEYS.hipHopDancing,
    label: ACTION_LABELS.hipHopDancing,
    type: ACTION_TYPES.SPECIAL,
    clipKey: ENERGY_LEVEL_TO_CLIP[ACTION_KEYS.hipHopDancing],
    available: true,
    baseWeight: 50,
    clipSpeed: 1,
    worldSpeed: 0.04,
    motionKind: "neutral",
  }),
];

export function getEnergyLevel(steps: number, goal = DEFAULT_STEP_GOAL) {
  return getEnergyLevelFromSteps(steps, goal);
}

export function getEnergyState(steps: number, goal = DEFAULT_STEP_GOAL) {
  const ratio = getStepRatio(steps, goal);

  if (ratio < 0.35) return ENERGY_STATES.LOW_ENERGY;
  if (ratio < 0.85) return ENERGY_STATES.NORMAL_ENERGY;
  return ENERGY_STATES.HIGH_ENERGY;
}

export function getEnergyStateForLevel(level: number) {
  if (level <= 1) return ENERGY_STATES.LOW_ENERGY;
  if (level <= 4) return ENERGY_STATES.NORMAL_ENERGY;
  return ENERGY_STATES.HIGH_ENERGY;
}

export function getLongTermState(history: Array<{ steps: number }> = [], goal = DEFAULT_STEP_GOAL) {
  const growth = getGrowthProgress(history, goal);
  const lifetimeSteps = growth.lifetimeSteps ?? 0;

  if (lifetimeSteps < goal * 4) return LONG_TERM_STATES.WEAK;
  if (lifetimeSteps < goal * 12) return LONG_TERM_STATES.HEALTHY;
  return LONG_TERM_STATES.ACTIVE;
}

export function buildBehaviorProfile({
  steps = 0,
  history = [],
  goal = DEFAULT_STEP_GOAL,
  overrides = {},
}: {
  steps?: number;
  history?: Array<{ steps: number }>;
  goal?: number;
  overrides?: {
    forceEnergyLevel?: number | null;
    forceLongTermState?: string | null;
    forceSpecialActionKey?: string | null;
    forcedActionKey?: string | null;
    walkingSpeedMultiplier?: number;
    runningSpeedMultiplier?: number;
    animationSpeedMultiplier?: number;
  };
} = {}) {
  const energyLevel = overrides.forceEnergyLevel ?? getEnergyLevel(steps, goal);
  const rawEnergyState = getEnergyState(steps, goal);
  const forcedEnergyState = getEnergyStateForLevel(energyLevel);
  const rawLongTermState = getLongTermState(history, goal);
  const energyState = forcedEnergyState ?? rawEnergyState;
  const longTermState = (overrides.forceLongTermState as string | null | undefined) ?? rawLongTermState;
  const backgroundState = energyState;

  const mainActions = MAIN_ACTION_LIBRARY.map((action) => ({
    ...action,
    clipSpeed: roundToThree(action.clipSpeed * (overrides.animationSpeedMultiplier ?? 1)),
    worldSpeed: roundToThree(action.worldSpeed * resolveMovementMultiplier(action.motionKind, overrides)),
    weight: action.baseWeight,
  }));
  const specialActions = SPECIAL_ACTION_LIBRARY.map((action) => ({
    ...action,
    clipSpeed: roundToThree(action.clipSpeed * (overrides.animationSpeedMultiplier ?? 1)),
    worldSpeed: roundToThree(action.worldSpeed * resolveMovementMultiplier(action.motionKind, overrides)),
    weight: action.baseWeight,
  }));
  const allActions = [...mainActions, ...specialActions];
  const actionMap = allActions.reduce<Record<string, Action>>((map, action) => {
    map[action.key] = action;
    return map;
  }, {});
  const mainActionMap = mainActions.reduce<Record<string, Action>>((map, action) => {
    map[action.key] = action;
    return map;
  }, {});

  const specialActionChance = roundToThree(
    Math.min(1, specialActions.reduce((sum, action) => sum + (action.weight ?? action.baseWeight ?? 0), 0) / 100),
  );

  const defaultMainActionKey = ENERGY_LEVEL_TO_STATE[energyLevel] ?? ACTION_KEYS.energy3;
  const energyAction = mainActionMap[defaultMainActionKey] ?? mainActions[3] ?? mainActions[0];
  const forcedSpecialAction =
    energyLevel === 6 ? resolveActionByKey(specialActions, overrides.forceSpecialActionKey) : null;
  const forcedAction = resolveActionByKey(allActions, overrides.forcedActionKey);
  const currentAction = forcedSpecialAction ?? forcedAction ?? energyAction;

  return {
    energyLevel,
    energyState,
    longTermState,
    backgroundState,
    mainActions,
    specialActions,
    allActions,
    actionMap,
    mainActionMap,
    defaultMainActionKey,
    currentAction,
    animationState: currentAction.key,
    animationClip: ENERGY_LEVEL_TO_CLIP[currentAction.key] ?? currentAction.clipKey,
    animationSpeed: roundToThree((overrides.animationSpeedMultiplier ?? 1) * (ENERGY_LEVEL_TO_ANIMATION_SPEED[currentAction.key] ?? 1)),
    specialActionPool: [
      {
        key: ACTION_KEYS.hipHopDancing,
        clipKey: ENERGY_LEVEL_TO_CLIP[ACTION_KEYS.hipHopDancing],
        weight: 100,
        label: ACTION_LABELS.hipHopDancing,
      },
    ],
    specialActionChance,
  };
}

export function resolveActionByKey(actions: Action[] = [], actionKey: string | null | undefined) {
  if (!actionKey) return null;
  return actions.find((action) => action.key === actionKey) ?? null;
}

function resolveMovementMultiplier(
  motionKind: string,
  overrides: {
    walkingSpeedMultiplier?: number | null;
    runningSpeedMultiplier?: number | null;
    animationSpeedMultiplier?: number | null;
    forceEnergyLevel?: number | null;
    forceLongTermState?: string | null;
    forceSpecialActionKey?: string | null;
    forcedActionKey?: string | null;
  },
) {
  if (motionKind === "walk") {
    return overrides.walkingSpeedMultiplier ?? 1;
  }

  if (motionKind === "run") {
    return overrides.runningSpeedMultiplier ?? 1;
  }

  return 1;
}

function roundToThree(value: number) {
  return Math.round(value * 1000) / 1000;
}
