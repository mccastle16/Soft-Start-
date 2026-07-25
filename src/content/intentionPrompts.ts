/** Appendix A — Intention Prompt Set (v1). Cycles by one each day, so with 12 prompts none repeats within any 7-day window. */
export const INTENTION_PROMPTS: readonly string[] = [
  'What would make today feel good?',
  "What's one thing that, if done, would make today feel complete?",
  'Finish this: today will be a good day if I ______.',
  "What are you looking forward to today?",
  'How do you want to feel by tonight?',
  "What's something you're grateful for this morning?",
  "What's one small thing you can do for future-you today?",
  'Which part of today are you most curious about?',
  'What does showing up look like for you today?',
  'If today gets hard, how will you be kind to yourself?',
  'What strength of yours gets to shine today?',
  "What's one distraction you're happy to let rest today?",
];

export function nextIntentionPromptId(previousPromptId: number | undefined): number {
  if (previousPromptId === undefined) return 0;
  return (previousPromptId + 1) % INTENTION_PROMPTS.length;
}
