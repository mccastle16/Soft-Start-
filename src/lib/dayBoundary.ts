import type { Weekday } from '../types';

/** The current "day" persists until 4:00am, not midnight — late nights never hit a jarring rollover. */
export const DAY_BOUNDARY_HOUR = 4;

const WEEKDAY_BY_JS_DAY: Record<number, Weekday> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

function formatDateString(d: Date): string {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateString(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** YYYY-MM-DD of the logical day `now` belongs to, per the 4:00am boundary. */
export function getLogicalDateString(now: Date): string {
  const logical = new Date(now);
  if (now.getHours() < DAY_BOUNDARY_HOUR) {
    logical.setDate(logical.getDate() - 1);
  }
  return formatDateString(logical);
}

export function getWeekdayFromDate(date: string): Weekday {
  return WEEKDAY_BY_JS_DAY[parseDateString(date).getDay()];
}

export function previousDateString(date: string): string {
  const d = parseDateString(date);
  d.setDate(d.getDate() - 1);
  return formatDateString(d);
}

export function nextDateString(date: string): string {
  const d = parseDateString(date);
  d.setDate(d.getDate() + 1);
  return formatDateString(d);
}

/** The 7 dates (Monday–Sunday) of the week containing `date`. */
export function getWeekDates(date: string): string[] {
  const d = parseDateString(date);
  const mondayOffset = (d.getDay() + 6) % 7; // getDay(): 0=Sunday..6=Saturday -> days since this week's Monday
  const monday = new Date(d);
  monday.setDate(monday.getDate() - mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(day.getDate() + i);
    return formatDateString(day);
  });
}

/** "July 20 – 26", or "July 28 – August 3" when the week crosses a month. */
export function formatWeekRangeLabel(startDate: string, endDate: string): string {
  const start = parseDateString(startDate);
  const end = parseDateString(endDate);
  const startLabel = start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const endLabel =
    start.getMonth() === end.getMonth()
      ? `${end.getDate()}`
      : end.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return `${startLabel} – ${endLabel}`;
}

/** Minutes elapsed since local midnight of `date` — may exceed 1439 for a `now` after midnight but before the 4am boundary. */
export function getNowMinuteForDate(date: string, now: Date): number {
  const midnight = parseDateString(date);
  return Math.round((now.getTime() - midnight.getTime()) / 60_000);
}
