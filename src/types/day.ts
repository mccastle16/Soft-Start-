import type { DayBlock } from './block';
import type { Weekday } from './template';

export interface DayIntention {
  /** Index into the Appendix A prompt set (0-based). */
  promptId: number;
  answer: string;
}

/**
 * A single calendar day's live plan, keyed by date using the app's logical
 * day boundary (4:00am) rather than midnight — see the day lifecycle state
 * machine in the screens/IA doc.
 */
export interface DailyPlan {
  /** YYYY-MM-DD, the logical day this plan belongs to. */
  date: string;
  weekday: Weekday;
  blocks: DayBlock[];
  /**
   * Today's effective day bounds. Seeded from the template/global DayShape,
   * then possibly widened by the Re-flow Engine's day-length question or a
   * boundary-crossing edit (N2) — never narrowed automatically.
   */
  dayStartMinute: number;
  dayEndMinute: number;
  intention?: DayIntention;
  /** Index into the Appendix B greeting quote set (0-based); tracked so the same quote never shows two days running. */
  greetingQuoteId: number;
  /** ISO timestamp the morning ritual (greeting + intention) completed; absent until it does. */
  ritualCompletedAt?: string;
  /** Whether the 100%-day petal celebration has already played — fires once per day (edge case 20), not on every evening-view visit. */
  celebrationShown?: boolean;
  createdAt: string;
}
