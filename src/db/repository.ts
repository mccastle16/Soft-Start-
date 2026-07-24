import { db } from './db';
import { WEEKDAYS, type DayTemplate, type Weekday } from '../types/template';
import type { DailyPlan } from '../types/day';
import { DEFAULT_APP_SETTINGS, type AppSettings } from '../types/settings';

/** Ensures the 7 weekday templates and the singleton settings row exist. Safe to call on every app boot. */
export async function seedDatabase(): Promise<void> {
  await db.transaction('rw', db.dayTemplates, db.settings, async () => {
    const existingWeekdays = new Set(await db.dayTemplates.toCollection().primaryKeys());
    const missing: DayTemplate[] = WEEKDAYS.filter((weekday) => !existingWeekdays.has(weekday)).map(
      (weekday) => ({ weekday, blocks: [] }),
    );
    if (missing.length > 0) {
      await db.dayTemplates.bulkAdd(missing);
    }

    const settings = await db.settings.get('app');
    if (!settings) {
      await db.settings.add(DEFAULT_APP_SETTINGS);
    }
  });
}

export function getDayTemplate(weekday: Weekday): Promise<DayTemplate | undefined> {
  return db.dayTemplates.get(weekday);
}

export function getAllDayTemplates(): Promise<DayTemplate[]> {
  return db.dayTemplates.toArray();
}

export function saveDayTemplate(template: DayTemplate): Promise<Weekday> {
  return db.dayTemplates.put(template);
}

export function getDailyPlan(date: string): Promise<DailyPlan | undefined> {
  return db.dailyPlans.get(date);
}

export function getDailyPlansInRange(startDate: string, endDate: string): Promise<DailyPlan[]> {
  return db.dailyPlans.where('date').between(startDate, endDate, true, true).toArray();
}

export function saveDailyPlan(plan: DailyPlan): Promise<string> {
  return db.dailyPlans.put(plan);
}

export async function getSettings(): Promise<AppSettings> {
  const settings = await db.settings.get('app');
  return settings ?? DEFAULT_APP_SETTINGS;
}

export async function updateSettings(patch: Partial<Omit<AppSettings, 'id'>>): Promise<AppSettings> {
  const current = await getSettings();
  const next: AppSettings = { ...current, ...patch };
  await db.settings.put(next);
  return next;
}
