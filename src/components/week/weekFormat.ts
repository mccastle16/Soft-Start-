export function dayOfMonth(date: string): number {
  return Number(date.split('-')[2]);
}

/** "You showed up for 4 things" — additive, no accounting language, no zero-done variant (past cards with 0 done render nothing at all). */
export function formatShowedUpLine(count: number): string {
  return `You showed up for ${count} ${count === 1 ? 'thing' : 'things'}`;
}
