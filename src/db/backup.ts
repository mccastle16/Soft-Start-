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
