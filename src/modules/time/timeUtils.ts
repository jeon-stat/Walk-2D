export function getDateLabel(dateISO: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(new Date(dateISO));
}

export function getCurrentTimeLabel(minutesOfDay: number) {
  const hours = Math.floor(minutesOfDay / 60) % 24;
  const minutes = minutesOfDay % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function timePeriodLabel(minutesOfDay: number) {
  if (minutesOfDay >= 360 && minutesOfDay < 720) return "아침";
  if (minutesOfDay >= 720 && minutesOfDay < 1020) return "점심";
  if (minutesOfDay >= 1020 && minutesOfDay < 1320) return "저녁";
  return "밤";
}

export function advanceClock(dateISO: string, minutesOfDay: number, deltaMinutes: number) {
  const totalMinutes = minutesOfDay + deltaMinutes;
  const dayCarry = Math.floor(totalMinutes / 1440);
  const nextMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const nextDate = new Date(dateISO);
  nextDate.setDate(nextDate.getDate() + dayCarry);
  return {
    currentDateISO: nextDate.toISOString(),
    minutesOfDay: nextMinutes
  };
}
