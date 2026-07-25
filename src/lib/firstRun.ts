import type { TemplateBlock } from '../types/block';
import type { DayShape } from '../types/settings';
import type { DayTemplate, Weekday } from '../types/template';
import { WEEKDAYS, WEEKEND_DAYS } from '../types/template';

/** Monday–Friday, in order — the only days the build-and-echo loop auto-offers. */
export const WEEKDAYS_MON_FRI: readonly Weekday[] = WEEKDAYS.filter((day) => !WEEKEND_DAYS.includes(day));

/** A day counts as "built" once it has any non-anchored block — an anchor alone (from S0.3) doesn't count. */
export function hasNonAnchoredBlocks(blocks: TemplateBlock[]): boolean {
  return blocks.some((block) => block.tier !== 'anchored');
}

function isWeekdayBuilt(template: DayTemplate | undefined): boolean {
  return hasNonAnchoredBlocks(template?.blocks ?? []);
}

/** The next Mon–Fri day still genuinely uncovered — neither built nor explicitly left blank. Drives S0.5b's loop. */
export function firstEmptyWeekday(
  templates: readonly DayTemplate[],
  skipped: readonly Weekday[] = [],
): Weekday | undefined {
  const templatesByWeekday = new Map(templates.map((template) => [template.weekday, template]));
  return WEEKDAYS_MON_FRI.find((weekday) => {
    if (skipped.includes(weekday)) return false;
    return !isWeekdayBuilt(templatesByWeekday.get(weekday));
  });
}

/** A fresh set of ids for a copied day — same shape, no shared identity with the source's blocks. */
export function cloneTemplateBlocks(blocks: TemplateBlock[]): TemplateBlock[] {
  return blocks.map((block) => ({ ...block, id: crypto.randomUUID() }));
}

/**
 * S0.4's starting point for a weekday that hasn't been built yet: ease-in and
 * lunch pre-placed alongside whatever anchors S0.3 may have already written
 * in for it. Checks for existing non-anchored blocks (not a flow-position
 * assumption) so it stays correct on resume.
 */
export function withDefaultsIfNeeded(blocks: TemplateBlock[], dayShape: DayShape): TemplateBlock[] {
  return hasNonAnchoredBlocks(blocks) ? blocks : [...buildDefaultDayBlocks(dayShape), ...blocks];
}

/** Ease-in + lunch, per §6.1's "never forgotten by design" default. */
export function buildDefaultDayBlocks(dayShape: DayShape): TemplateBlock[] {
  return [
    {
      id: crypto.randomUUID(),
      title: 'Ease in',
      category: 'ease-in',
      tier: 'protected',
      startMinute: dayShape.dayStartMinute,
      endMinute: dayShape.activeStartMinute,
    },
    {
      id: crypto.randomUUID(),
      title: 'Lunch',
      category: 'life',
      tier: 'protected',
      startMinute: dayShape.lunchStartMinute,
      endMinute: dayShape.lunchStartMinute + dayShape.lunchDurationMinutes,
      minDurationMinutes: 30,
    },
  ];
}
