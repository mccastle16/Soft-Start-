/** Time-aware greeting word for R1 — never clock-shamey, just a hello that matches the hour. */
export function getTimeAwareGreeting(now: Date): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** A multi-day gap (edge case 9) swaps the greeting for a warm welcome-back — never a mention of the gap itself. */
export function isGapReturn(lastRitualDate: string | undefined, today: string): boolean {
  if (!lastRitualDate) return false;
  const last = new Date(lastRitualDate);
  const current = new Date(today);
  const daysSince = Math.round((current.getTime() - last.getTime()) / 86_400_000);
  return daysSince > 1;
}
