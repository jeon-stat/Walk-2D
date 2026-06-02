import { create } from "zustand";
import { LocationId } from "../location/locationCatalog";
import { advanceClock, getCurrentTimeLabel, getDateLabel } from "../time/timeUtils";

type WorldStore = {
  locationId: LocationId;
  currentDateISO: string;
  minutesOfDay: number;
  setLocation: (locationId: LocationId) => void;
  advanceTime: (minutes: number) => void;
  currentDateLabel: string;
  currentTimeLabel: string;
};

const now = new Date();

export const useWorldStore = create<WorldStore>((set, get) => ({
  locationId: "home",
  currentDateISO: now.toISOString(),
  minutesOfDay: now.getHours() * 60 + now.getMinutes(),
  setLocation: (locationId) => set({ locationId }),
  advanceTime: (minutes) =>
    set((state) => {
      const nextClock = advanceClock(state.currentDateISO, state.minutesOfDay, minutes);
      return {
        currentDateISO: nextClock.currentDateISO,
        minutesOfDay: nextClock.minutesOfDay,
        currentDateLabel: getDateLabel(nextClock.currentDateISO),
        currentTimeLabel: getCurrentTimeLabel(nextClock.minutesOfDay)
      };
    }),
  currentDateLabel: getDateLabel(now.toISOString()),
  currentTimeLabel: getCurrentTimeLabel(now.getHours() * 60 + now.getMinutes())
}));
