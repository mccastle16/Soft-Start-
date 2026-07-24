export type BlockCategory =
  | 'ease-in'
  | 'work'
  | 'side-project'
  | 'spanish'
  | 'workout'
  | 'life'
  | 'other';

export const CATEGORIES: readonly BlockCategory[] = [
  'ease-in',
  'work',
  'side-project',
  'spanish',
  'workout',
  'life',
  'other',
];

export const CATEGORY_LABELS: Record<BlockCategory, string> = {
  'ease-in': 'Ease-in',
  work: 'Work',
  'side-project': 'Side project',
  spanish: 'Spanish',
  workout: 'Workout',
  life: 'Life',
  other: 'Other',
};

/**
 * Anchored: fixed wall-clock time, never moves or compresses during re-flow.
 * Protected: slides and compresses to its minimum duration, but never dropped
 * (never appears on the didn't-fit sheet). Lunch is protected by default.
 * Flexible: slides, compresses to its minimum, and overflows to the
 * didn't-fit sheet when it can't fit even at minimum. Default tier.
 */
export type BlockTier = 'anchored' | 'protected' | 'flexible';

export const DEFAULT_MIN_DURATION_MINUTES = 15;

interface BlockBase {
  title: string;
  category: BlockCategory;
  tier: BlockTier;
  /**
   * Minutes after midnight of the plan's calendar date. May exceed 1439 for
   * blocks after midnight — the day boundary is 4:00am, not midnight, so a
   * late-night block is still "today" and its minute value keeps counting up.
   */
  startMinute: number;
  endMinute: number;
  /**
   * The floor duration the Re-flow Engine will compress this block to before
   * treating it as overflow. Ignored for anchored blocks, which never
   * compress. Defaults to DEFAULT_MIN_DURATION_MINUTES for protected/flexible
   * blocks when not set.
   */
  minDurationMinutes?: number;
}

/** A block as it lives in a weekday's weekly rhythm template. */
export interface TemplateBlock extends BlockBase {
  id: string;
}

/**
 * Vocabulary matches the product's allowlist (done · resting · moved) —
 * never "missed" or "overdue".
 */
export type BlockStatus = 'pending' | 'done' | 'resting' | 'moved';

/** A block instance on one specific day's live plan. */
export interface DayBlock extends BlockBase {
  id: string;
  /** The template block this instance was generated from; absent for one-off additions made via "+". */
  templateBlockId?: string;
  status: BlockStatus;
  /** True for one-off additions; false for blocks generated from the weekly template. */
  isOneOff: boolean;
}
