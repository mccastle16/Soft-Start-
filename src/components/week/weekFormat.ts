export function dayOfMonth(date: string): number {
  return Number(date.split('-')[2]);
}

export function formatDateLabel(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

/** "You showed up for 4 things" — additive, no accounting language, no zero-done variant (past cards with 0 done render nothing at all). */
export function formatShowedUpLine(count: number): string {
  return `You showed up for ${count} ${count === 1 ? 'thing' : 'things'}`;
}
