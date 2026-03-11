export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getStreakData(): { streak: number; lastCheckedIn: string | null; longestStreak: number } {
  try {
    const raw = localStorage.getItem("vibequotes-streak");
    if (!raw) return { streak: 0, lastCheckedIn: null, longestStreak: 0 };
    return JSON.parse(raw);
  } catch {
    return { streak: 0, lastCheckedIn: null, longestStreak: 0 };
  }
}

export function recordTodayVisit(): { streak: number; longestStreak: number; isNewDay: boolean } {
  const today = getTodayKey();
  const data = getStreakData();

  if (data.lastCheckedIn === today) {
    return { streak: data.streak, longestStreak: data.longestStreak, isNewDay: false };
  }

  let newStreak = 1;
  if (data.lastCheckedIn) {
    const last = new Date(data.lastCheckedIn);
    const now = new Date(today);
    const diffMs = now.getTime() - last.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      newStreak = data.streak + 1;
    }
  }

  const longestStreak = Math.max(newStreak, data.longestStreak);

  try {
    localStorage.setItem(
      "vibequotes-streak",
      JSON.stringify({ streak: newStreak, lastCheckedIn: today, longestStreak })
    );
  } catch {}

  return { streak: newStreak, longestStreak, isNewDay: true };
}

export function getQOTDForDate(dateKey: string, quoteCount: number): number {
  // Deterministic index from date string
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return hash % quoteCount;
}

export function getCalendarMonthData(year: number, month: number): { date: string; quoteIndex: number }[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: { date: string; quoteIndex: number }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    result.push({ date: dateKey, quoteIndex: getQOTDForDate(dateKey, 500) });
  }
  return result;
}
