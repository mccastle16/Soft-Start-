import { useCallback, useEffect, useState } from 'react';
import { previewBlocksForTemplate } from '../db/planGenerator';
import { getAllDayTemplates, getDailyPlansInRange, getSettings } from '../db/repository';
import { getLogicalDateString, getWeekDates, getWeekdayFromDate } from '../lib/dayBoundary';
import type { DayBlock, Weekday } from '../types';

export interface WeekDay {
  date: string;
  weekday: Weekday;
  blocks: DayBlock[];
  dayStartMinute: number;
  dayEndMinute: number;
}

/** Loads the 7 days (Monday–Sunday) containing today: persisted plans where they exist, template previews for the rest of the future. */
export function useWeekPlans(): { days: WeekDay[] | null; refresh: () => void } {
  const [days, setDays] = useState<WeekDay[] | null>(null);
  const [generation, setGeneration] = useState(0);

  const refresh = useCallback(() => setGeneration((g) => g + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const todayDate = getLogicalDateString(new Date());
      const weekDates = getWeekDates(todayDate);
      const [persistedPlans, settings, templates] = await Promise.all([
        getDailyPlansInRange(weekDates[0], weekDates[6]),
        getSettings(),
        getAllDayTemplates(),
      ]);
      if (cancelled) return;

      const plansByDate = new Map(persistedPlans.map((plan) => [plan.date, plan]));
      const templatesByWeekday = new Map(templates.map((template) => [template.weekday, template]));

      const result: WeekDay[] = weekDates.map((date) => {
        const weekday = getWeekdayFromDate(date);
        const persisted = plansByDate.get(date);
        if (persisted) {
          return {
            date,
            weekday,
            blocks: persisted.blocks,
            dayStartMinute: persisted.dayStartMinute,
            dayEndMinute: persisted.dayEndMinute,
          };
        }
        if (date < todayDate) {
          // Never opened — auto-rested silently, no carry-over backlog (edge case 8).
          return { date, weekday, blocks: [], dayStartMinute: 0, dayEndMinute: 0 };
        }
        const template = templatesByWeekday.get(weekday);
        const dayShape = { ...settings.dayShape, ...template?.dayShapeOverride };
        return {
          date,
          weekday,
          blocks: previewBlocksForTemplate(template),
          dayStartMinute: dayShape.dayStartMinute,
          dayEndMinute: dayShape.dayEndMinute,
        };
      });

      setDays(result);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [generation]);

  return { days, refresh };
}
