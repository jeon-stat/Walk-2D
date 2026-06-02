import { create } from "zustand";
import { LocationId } from "../location/locationCatalog";
import { advanceClock, getCurrentTimeLabel, getDateLabel } from "../time/timeUtils";

export type WorldEventKind = "location" | "time" | "dialogue" | "action" | "system";

export type WorldEvent = {
  id: string;
  kind: WorldEventKind;
  title: string;
  detail: string;
  timestampLabel: string;
};

type WorldStore = {
  locationId: LocationId;
  currentDateISO: string;
  minutesOfDay: number;
  events: WorldEvent[];
  setLocation: (locationId: LocationId) => void;
  advanceTime: (minutes: number) => void;
  logEvent: (event: Omit<WorldEvent, "id" | "timestampLabel">) => void;
  clearEvents: () => void;
  currentDateLabel: string;
  currentTimeLabel: string;
};

const now = new Date();

export const useWorldStore = create<WorldStore>((set, get) => ({
  locationId: "home",
  currentDateISO: now.toISOString(),
  minutesOfDay: now.getHours() * 60 + now.getMinutes(),
  events: [],
  setLocation: (locationId) =>
    set((state) => ({
      locationId,
      events: [
        ...state.events,
        {
          id: crypto.randomUUID(),
          kind: "location",
          title: "장소 이동",
          detail: `${locationId}로 이동했습니다.`,
          timestampLabel: state.currentTimeLabel
        }
      ]
    })),
  advanceTime: (minutes) =>
    set((state) => {
      const nextClock = advanceClock(state.currentDateISO, state.minutesOfDay, minutes);
      return {
        currentDateISO: nextClock.currentDateISO,
        minutesOfDay: nextClock.minutesOfDay,
        currentDateLabel: getDateLabel(nextClock.currentDateISO),
        currentTimeLabel: getCurrentTimeLabel(nextClock.minutesOfDay),
        events: [
          ...state.events,
          {
            id: crypto.randomUUID(),
            kind: "time",
            title: `${minutes}분 진행`,
            detail: `시간이 ${minutes}분 흘렀습니다.`,
            timestampLabel: getCurrentTimeLabel(nextClock.minutesOfDay)
          }
        ]
      };
    }),
  logEvent: (event) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          ...event,
          id: crypto.randomUUID(),
          timestampLabel: state.currentTimeLabel
        }
      ]
    })),
  clearEvents: () => set({ events: [] }),
  currentDateLabel: getDateLabel(now.toISOString()),
  currentTimeLabel: getCurrentTimeLabel(now.getHours() * 60 + now.getMinutes())
}));
