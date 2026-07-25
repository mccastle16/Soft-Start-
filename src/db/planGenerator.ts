import { nextGreetingQuoteId } from '../content/greetingQuotes';
import { getWeekdayFromDate, nextDateString, previousDateString } from '../lib/dayBoundary';
import type { DailyPlan, DayBlock, TemplateBlock, Weekday } from '../types';
import { getDailyPlan, getDayTemplate, getSettings, saveDailyPlan, saveDayTemplate } from './repository';

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

/**
 * SH2's (and Week's day-targeted add's) persistence: get-or-create that
 * date's plan, append the one-off block, and optionally widen its bounds
 * (N2, already confirmed by the caller).
 */
export async function addOneOffBlockToDate(
  date: string,
  block: DayBlock,
  newDayStartMinute?: number,
  newDayEndMinute?: number,
): Promise<void> {
  const plan = await getOrCreateDailyPlan(date, new Date());
  await saveDailyPlan({
    ...plan,
    blocks: [...plan.blocks, block],
    dayStartMinute: newDayStartMinute ?? plan.dayStartMinute,
    dayEndMinute: newDayEndMinute ?? plan.dayEndMinute,
  });
}

/**
 * SH1's "Move to tomorrow": inserts a one-off copy into tomorrow's plan
 * (generating it from the template first if it doesn't exist yet). Dropped
 * `templateBlockId` so the copy never gets confused with tomorrow's own
 * regularly-generated instance of the same template block.
 */
export async function moveBlockToTomorrow(fromDate: string, block: DayBlock): Promise<void> {
  const copy: DayBlock = {
    ...block,
    id: crypto.randomUUID(),
    templateBlockId: undefined,
    status: 'pending',
    isOneOff: true,
  };
  await addOneOffBlockToDate(nextDateString(fromDate), copy);
}

/** Week's future-day preview: a read-only, never-persisted rendering of what the template would generate. */
export function previewBlocksForTemplate(template: { blocks: TemplateBlock[] } | undefined): DayBlock[] {
  return (template?.blocks ?? []).map(toDayBlock);
}

/**
 * SH1/SH2's "Also add to my weekly rhythm": the sole, explicit path from a
 * one-off block to a permanent one (edge case 26). Never happens implicitly.
 */
export async function addBlockToTemplate(weekday: Weekday, block: DayBlock): Promise<void> {
  const template = (await getDayTemplate(weekday)) ?? { weekday, blocks: [] };
  const templateBlock: TemplateBlock = {
    id: crypto.randomUUID(),
    title: block.title,
    category: block.category,
    tier: block.tier,
    startMinute: block.startMinute,
    endMinute: block.endMinute,
    minDurationMinutes: block.minDurationMinutes,
  };
  await saveDayTemplate({ ...template, blocks: [...template.blocks, templateBlock] });
}

export interface AnchorDraft {
  title: string;
  category: DayBlock['category'];
  weekdays: Weekday[];
  startMinute: number;
  endMinute: number;
}

/** S0.3's anchors: written straight into every weekday they apply to, ahead of that weekday ever being built. */
export async function applyAnchorsToTemplates(anchors: AnchorDraft[]): Promise<void> {
  const affectedWeekdays = [...new Set(anchors.flatMap((anchor) => anchor.weekdays))];
  await Promise.all(
    affectedWeekdays.map(async (weekday) => {
      const template = (await getDayTemplate(weekday)) ?? { weekday, blocks: [] };
      const newBlocks: TemplateBlock[] = anchors
        .filter((anchor) => anchor.weekdays.includes(weekday))
        .map((anchor) => ({
          id: crypto.randomUUID(),
          title: anchor.title,
          category: anchor.category,
          tier: 'anchored',
          startMinute: anchor.startMinute,
          endMinute: anchor.endMinute,
        }));
      await saveDayTemplate({ ...template, blocks: [...template.blocks, ...newBlocks] });
    }),
  );
}
