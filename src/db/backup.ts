import { db } from './db';
import type { AppSettings } from '../types/settings';
import type { DailyPlan } from '../types/day';
import type { DayTemplate } from '../types/template';
import { getAllDailyPlans, getAllDayTemplates, getSettings } from './repository';

/** The full local-first dataset (§6.7's "cheap insurance"): settings, weekly templates, and every day's plan. */
export async function buildBackupJson(): Promise<string> {
  const [settings, templates, dailyPlans] = await Promise.all([
    getSettings(),
    getAllDayTemplates(),
    getAllDailyPlans(),
  ]);
  return JSON.stringify({ exportedAt: new Date().toISOString(), settings, templates, dailyPlans }, null, 2);
}

/** Downloads the backup as a JSON file — no server round-trip, matches the local-first shape of the app. */
export async function downloadBackup(): Promise<void> {
  const json = await buildBackupJson();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `soft-start-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

interface BackupPayload {
  settings: AppSettings;
  templates: DayTemplate[];
  dailyPlans: DailyPlan[];
}

function isBackupPayload(value: unknown): value is BackupPayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Record<string, unknown>;
  return typeof payload.settings === 'object' && Array.isArray(payload.templates) && Array.isArray(payload.dailyPlans);
}

/** S3.3's "Import a backup…" — replaces the entire local dataset (edge case 18's recovery path for a cleared browser or a replaced phone). */
export async function importBackupJson(json: string): Promise<void> {
  const parsed: unknown = JSON.parse(json);
  if (!isBackupPayload(parsed)) {
    throw new Error('Not a Soft Start backup file.');
  }

  await db.transaction('rw', db.settings, db.dayTemplates, db.dailyPlans, async () => {
    await Promise.all([db.settings.clear(), db.dayTemplates.clear(), db.dailyPlans.clear()]);
    await db.settings.put(parsed.settings);
    if (parsed.templates.length > 0) await db.dayTemplates.bulkAdd(parsed.templates);
    if (parsed.dailyPlans.length > 0) await db.dailyPlans.bulkAdd(parsed.dailyPlans);
  });
}
