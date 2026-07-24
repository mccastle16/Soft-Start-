/** Appendix B — Greeting Quote Set (v1). Never the same quote two days in a row. */
export const GREETING_QUOTES: readonly string[] = [
  'Every day counts.',
  'The day starts when you do.',
  'Small steps, real momentum.',
  'Begin gently.',
  'Today is enough.',
  'Showing up is the whole trick.',
  'One thing at a time.',
  'Soft starts still count.',
];

export function nextGreetingQuoteId(previousQuoteId: number | undefined): number {
  if (previousQuoteId === undefined) return 0;
  return (previousQuoteId + 1) % GREETING_QUOTES.length;
}
