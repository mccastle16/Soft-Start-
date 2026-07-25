import { useCallback, useEffect, useState } from 'react';
import { getOrCreateDailyPlan } from '../db/planGenerator';
import { saveDailyPlan, seedDatabase } from '../db/repository';
import { getLogicalDateString } from '../lib/dayBoundary';
import type { DailyPlan } from '../types';

export type TodayPlanPatch = Partial<
  Pick<DailyPlan, 'blocks' | 'dayStartMinute' | 'dayEndMinute' | 'intention' | 'ritualCompletedAt'>
>;

/** Loads (generating on first access) today's plan per the 4:00am day boundary, plus a setter that persists edits. */
export function useTodayPlan(): [DailyPlan | null, (patch: TodayPlanPatch) => void] {
  const [plan, setPlan] = useState<DailyPlan | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      await seedDatabase();
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

  const updatePlan = useCallback((patch: TodayPlanPatch) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      void saveDailyPlan(next);
      return next;
    });
  }, []);

  return [plan, updatePlan];
}
