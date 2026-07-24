/**
 * The four day-shape values that are "fully user-owned" (PRD §6.1): the app
 * never adjusts, suggests, or learns new values on its own. Set once during
 * first-run (S0.2), editable anytime globally (Rhythm → Day Shape) or
 * per-weekday (see DayTemplate.dayShapeOverride).
 */
export interface DayShape {
  /** Ease-in begins, e.g. 8:00am -> 480 */
  dayStartMinute: number;
  /** Active blocks begin, e.g. 9:00am -> 540 */
  activeStartMinute: number;
  lunchStartMinute: number;
  lunchDurationMinutes: number;
  /** Default end of day, e.g. 5:00pm -> 1020 */
  dayEndMinute: number;
}

export const DEFAULT_DAY_SHAPE: DayShape = {
  dayStartMinute: 8 * 60,
  activeStartMinute: 9 * 60,
  lunchStartMinute: 12 * 60 + 30,
  lunchDurationMinutes: 60,
  dayEndMinute: 17 * 60,
};

/** Singleton app settings row; always stored under id 'app'. */
export interface AppSettings {
  id: 'app';
  dayShape: DayShape;
  hasCompletedFirstRun: boolean;
  /** Resume point for the abandon-and-resume first-run flow; absent once first run is complete. */
  firstRunStep?: string;
  /** YYYY-MM-DD of the last date the morning ritual was completed for; drives the 4:00am day-boundary check. */
  lastRitualDate?: string;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  id: 'app',
  dayShape: DEFAULT_DAY_SHAPE,
  hasCompletedFirstRun: false,
};
