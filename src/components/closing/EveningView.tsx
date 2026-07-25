import { useEffect, useState } from 'react';
import type { DayBlock } from '../../types';
import { DoneListRow } from './DoneListRow';
import { PetalConfetti } from './PetalConfetti';
import { WarmClose } from './WarmClose';

interface EveningViewProps {
  weekdayLabel: string;
  doneBlocks: DayBlock[];
  isComplete: boolean;
  celebrationShown: boolean;
  onCelebrationShown: () => void;
}

/**
 * S1's evening/after state (Flow 6a): shows only what was done, always closes on a warm line.
 * A 100% day adds the once-per-day petal celebration (edge 20).
 */
export function EveningView({ weekdayLabel, doneBlocks, isComplete, celebrationShown, onCelebrationShown }: EveningViewProps) {
  // Captured once at mount so the fall keeps playing even after onCelebrationShown flips the persisted flag mid-animation.
  const [showPetals] = useState(() => isComplete && !celebrationShown);

  useEffect(() => {
    if (isComplete && !celebrationShown) onCelebrationShown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showPetals && <PetalConfetti />}
      <div className="ss-evening-dayname">{weekdayLabel}</div>
      {doneBlocks.length > 0 && (
        <div className="ss-showedup">
          You showed up for
          <br />
          {doneBlocks.length} {doneBlocks.length === 1 ? 'thing' : 'things'} today
        </div>
      )}
      {doneBlocks.map((block) => (
        <DoneListRow key={block.id} title={block.title} slim={doneBlocks.length > 5} />
      ))}
      <WarmClose doneCount={doneBlocks.length} isComplete={isComplete} />
    </>
  );
}
