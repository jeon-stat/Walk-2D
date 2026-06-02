import { DEFAULT_STEP_GOAL } from "./stepRules";
import { getStreak } from "./progression";

function formatMemoryDate(date: string | null | undefined) {
  if (!date) return "";

  const value = new Date(date);
  return `${value.getMonth() + 1}월 ${value.getDate()}일`;
}

export function getMemories(history: Array<{ date?: string; steps: number }> = [], goal = DEFAULT_STEP_GOAL) {
  const memories: Array<{ id: string; title: string; summary: string; date: string | null }> = [];
  const firstGoalReached = [...history].reverse().find((record) => (record?.steps ?? 0) >= goal);
  const bestStepDay = history.reduce<{ date?: string; steps: number } | null>((best, record) => {
    if (!best || (record?.steps ?? 0) > (best?.steps ?? 0)) {
      return record;
    }
    return best;
  }, null);

  if (firstGoalReached) {
    memories.push({
      id: "firstGoalReached",
      title: "첫 목표 달성",
      summary: `${formatMemoryDate(firstGoalReached.date)}에 처음으로 산책 목표를 넘겼어요.`,
      date: firstGoalReached.date ?? null,
    });
  }

  if (getStreak(history, goal) >= 7) {
    memories.push({
      id: "sevenDayStreak",
      title: "7일 연속 산책",
      summary: "일주일 연속으로 목표를 이어 갔어요.",
      date: history[0]?.date ?? null,
    });
  }

  if (bestStepDay && (bestStepDay.steps ?? 0) > 0) {
    memories.push({
      id: "bestStepDay",
      title: "가장 많이 걸은 날",
      summary: `${formatMemoryDate(bestStepDay.date)}에 ${bestStepDay.steps.toLocaleString()}보를 걸었어요.`,
      date: bestStepDay.date ?? null,
    });
  }

  return memories.slice(0, 2);
}
