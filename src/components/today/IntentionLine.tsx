import type { DayIntention } from '../../types';

interface IntentionLineProps {
  intention?: DayIntention;
}

/** Absent — never a placeholder — when "Maybe later" was chosen during the ritual. */
export function IntentionLine({ intention }: IntentionLineProps) {
  if (!intention) return null;
  return (
    <div className="ss-intention">
      “{intention.answer}” <b>— today's intention</b>
    </div>
  );
}
