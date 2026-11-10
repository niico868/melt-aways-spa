/** Pure slot logic for the website booking form. Salon runs on Trinidad time (UTC-4, no DST). */
export const SALON_OFFSET = "-04:00";
const OFFSET_MIN = -240;

export interface Busy { starts_at: string; ends_at: string }

/** Today's date (YYYY-MM-DD) in salon time. */
export function salonToday(now = Date.now()): string {
  return new Date(now + OFFSET_MIN * 60000).toISOString().slice(0, 10);
}

/** Weekday (0=Sun) of a YYYY-MM-DD date. */
export function weekdayOf(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export function isDateDisabled(date: string, openDays: number[], now = Date.now()): boolean {
  return date < salonToday(now) || !openDays.includes(weekdayOf(date));
}

export function toIso(date: string, hhmm: string): string {
  return `${date}T${hhmm}:00${SALON_OFFSET}`;
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};
const fmt = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** Start times (HH:MM) every 30 min from open that fit before close, avoid busy periods, and are ≥1h away. */
export function availableSlots(opts: {
  date: string; durationMin: number; busy: Busy[]; open?: string; close?: string; now?: number;
}): string[] {
  const { date, durationMin, busy, open = "10:00", close = "16:00", now = Date.now() } = opts;
  const busyMs = busy.map((b) => [Date.parse(b.starts_at), Date.parse(b.ends_at)] as const);
  const out: string[] = [];
  for (let m = toMin(open); m + durationMin <= toMin(close); m += 30) {
    const t = fmt(m);
    const start = Date.parse(toIso(date, t));
    const end = start + durationMin * 60000;
    if (start - now < 3600000) continue;
    if (busyMs.some(([s, e]) => start < e && end > s)) continue;
    out.push(t);
  }
  return out;
}

export function formatTime(hhmm: string): string {
  const m = toMin(hhmm);
  const h = Math.floor(m / 60);
  return `${((h + 11) % 12) + 1}:${String(m % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Human sentence for the salon's opening hours, built from the booking system's
 * live schedule so the page can never contradict the calendar, e.g.
 * "Open Tuesday to Saturday, 10:00 AM – 4:00 PM."
 */
export function describeHours(hours: { days: number[]; open: string; close: string }): string {
  const days = [...new Set(hours.days)].filter((d) => d >= 0 && d <= 6).sort((a, b) => a - b);
  const time = `${formatTime(hours.open)} – ${formatTime(hours.close)}`;
  if (days.length === 0) return `Open ${time}.`;
  if (days.length === 7) return `Open daily, ${time}.`;
  const consecutive = days.every((d, i) => i === 0 || d === days[i - 1] + 1);
  const dayText =
    days.length === 1 ? DAY_NAMES[days[0]]
    : consecutive ? `${DAY_NAMES[days[0]]} to ${DAY_NAMES[days[days.length - 1]]}`
    : `${days.slice(0, -1).map((d) => DAY_NAMES[d]).join(", ")} and ${DAY_NAMES[days[days.length - 1]]}`;
  return `Open ${dayText}, ${time}.`;
}
