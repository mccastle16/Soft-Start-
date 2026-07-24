import { useEffect, useState } from 'react';
import { getOrCreateDailyPlan } from '../db/planGenerator';
import { seedDatabase } from '../db/repository';
import { seedExampleRhythm } from '../db/seedExampleRhythm';
import { getLogicalDateString } from '../lib/dayBoundary';
import type { DailyPlan } from '../types';

/** Loads (generating on first access) today's plan per the 4:00am day boundary. */
export function useTodayPlan(): DailyPlan | null {
  const [plan, setPlan] = useState<DailyPlan | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      await seedDatabase();
      await seedExampleRhythm();
      const now = new Date();
      const date = getLogicalDateString(now);
      const dailyPlan = await getOrCreateDailyPlan(date, now);
      if (!cancelled) setPlan(dailyPlan);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return plan;
}
