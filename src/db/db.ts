import Dexie, { type EntityTable } from 'dexie';
import type { AppSettings } from '../types/settings';
import type { DailyPlan } from '../types/day';
import type { DayTemplate } from '../types/template';

export class SoftStartDB extends Dexie {
  dayTemplates!: EntityTable<DayTemplate, 'weekday'>;
  dailyPlans!: EntityTable<DailyPlan, 'date'>;
  settings!: EntityTable<AppSettings, 'id'>;

  constructor() {
    super('soft-start');

    this.version(1).stores({
      dayTemplates: '&weekday',
      dailyPlans: '&date, weekday',
      settings: '&id',
    });
  }
}

export const db = new SoftStartDB();
