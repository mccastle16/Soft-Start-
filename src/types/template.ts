import type { TemplateBlock } from './block';
import type { DayShape } from './settings';

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const WEEKDAYS: readonly Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const WEEKEND_DAYS: readonly Weekday[] = ['saturday', 'sunday'];

/**
 * One weekday's plan blueprint. Saturday/Sunday start with an empty `blocks`
 * array and stay that way until explicitly templated (setup copy-over or
 * Rhythm) — the app itself never fills a weekend in.
 */
export interface DayTemplate {
  weekday: Weekday;
  blocks: TemplateBlock[];
  /** Per-weekday override of the global DayShape (§6.1); absent means "use the global DayShape". */
  dayShapeOverride?: Partial<DayShape>;
}
