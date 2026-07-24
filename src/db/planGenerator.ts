import { nextGreetingQuoteId } from '../content/greetingQuotes';
import { getWeekdayFromDate, previousDateString } from '../lib/dayBoundary';
import type { DailyPlan, DayBlock } from '../types';
import { getDailyPlan, getDayTemplate, getSettings, saveDailyPlan } from './repository';

function toDayBlock(templateBlock: {
  id: string;
  title: string;
  category: DayBlock['category'];
  tier: DayBlock['tier'];
  startMinute: number;
  endMinute: number;
  minDurationMinutes?: number;
}): DayBlock {
  return {
    id: crypto.randomUUID(),
    templateBlockId: templateBlock.id,
    title: templateBlock.title,
    category: templateBlock.category,
    tier: templateBlock.tier,
    startMinute: templateBlock.startMinute,
    endMinute: templateBlock.endMinute,
    minDurationMinutes: templateBlock.minDurationMinutes,
    status: 'pending',
    isOneOff: false,
  };
}

/**
 * Returns today's plan, generating it from the weekly template on first
 * access and persisting the result. Once a plan exists for a date it's
 * never regenerated — template edits apply from tomorrow, today stays stable.
 */
export async function getOrCreateDailyPlan(date: string, now: Date): Promise<DailyPlan> {
  const existing = await getDailyPlan(date);
  if (existing) return existing;

  const weekday = getWeekdayFromDate(date);
  const [template, settings, yesterday] = await Promise.all([
    getDayTemplate(weekday),
    getSettings(),
    getDailyPlan(previousDateString(date)),
  ]);

  const dayShape = { ...settings.dayShape, ...template?.dayShapeOverride };
  const blocks = (template?.blocks ?? []).map(toDayBlock);

  const plan: DailyPlan = {
    date,
    weekday,
    blocks,
    dayStartMinute: dayShape.dayStartMinute,
    dayEndMinute: dayShape.dayEndMinute,
    greetingQuoteId: nextGreetingQuoteId(yesterday?.greetingQuoteId),
    createdAt: now.toISOString(),
  };

  await saveDailyPlan(plan);
  return plan;
}
