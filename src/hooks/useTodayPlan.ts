import { useCallback, useEffect, useState } from 'react';
import { getOrCreateDailyPlan } from '../db/planGenerator';
import { saveDailyPlan, seedDatabase } from '../db/repository';
import { getLogicalDateString } from '../lib/dayBoundary';
import type { DailyPlan } from '../types';

export type TodayPlanPatch = Partial<
  Pick<DailyPlan, 'blocks' | 'dayStartMinute' | 'dayEndMinute' | 'intention' | 'ritualCompletedAt' | 'celebrationShown'>
>;

/** Loads (generating on first access) the plan for `date`, plus a setter that persists edits. */
export function useDailyPlan(date: string): [DailyPlan | null, (patch: TodayPlanPatch) => void] {
  const [plan, setPlan] = useState<DailyPlan | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPlan(null);

    async function load() {
      await seedDatabase();
      const dailyPlan = await getOrCreateDailyPlan(date, new Date());
      if (!cancelled) setPlan(dailyPlan);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [date]);

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

/** Today's plan per the 4:00am day boundary. */
export function useTodayPlan(): [DailyPlan | null, (patch: TodayPlanPatch) => void] {
  const [date] = useState(() => getLogicalDateString(new Date()));
  return useDailyPlan(date);
}
