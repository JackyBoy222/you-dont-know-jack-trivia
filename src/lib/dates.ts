import { format } from "date-fns";

export const SHOW_TIME_ZONE = "America/Chicago";
const venueFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: SHOW_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function venueParts(date: Date) {
  const parts = Object.fromEntries(venueFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

/** Legacy timestamps without offsets describe the venue's local wall clock. */
export function eventInstant(value: string): Date {
  if (/Z$|[+-]\d{2}:?\d{2}$/.test(value)) return new Date(value);
  const wallClock = new Date(`${value}Z`).getTime();
  let instant = wallClock;
  for (let i = 0; i < 3; i++) {
    const offset = new Date(`${venueParts(new Date(instant))}Z`).getTime() - instant;
    instant = wallClock - offset;
  }
  return new Date(instant);
}

export function formatShowDate(value: string | Date, pattern: string) {
  const instant = typeof value === "string" ? eventInstant(value) : value;
  // A local Date representing venue wall-clock parts is used only for formatting.
  return format(new Date(venueParts(instant)), pattern);
}

export function nthWednesday(year: number, month: number, occurrence: 1 | 2): Date {
  const first = new Date(Date.UTC(year, month, 1));
  const day = 1 + (3 - first.getUTCDay() + 7) % 7 + (occurrence - 1) * 7;
  const date = new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
  return eventInstant(`${date}T19:00:00`);
}
export function regularDates(year: number, month: number) {
  return [nthWednesday(year, month, 1), nthWednesday(year, month, 2)];
}
export function nextRegularDates(from = new Date(), count = 6) {
  const local = venueParts(from);
  let year = Number(local.slice(0, 4));
  let month = Number(local.slice(5, 7)) - 1;
  const dates: Date[] = [];
  while (dates.length < count) {
    dates.push(...regularDates(year, month).filter(date => date >= from));
    if (++month === 12) { month = 0; year++; }
  }
  return dates.slice(0, count);
}
export function toISODate(date: Date) { return date.toISOString(); }
