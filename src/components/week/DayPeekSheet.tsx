import { WEEKDAY_LABELS } from '../../lib/weekdayLabels';
import type { DayBlock, Weekday } from '../../types';
import { SheetContainer } from '../sheets/SheetContainer';
import { DoneListRow } from '../closing/DoneListRow';
import { activeBlocks } from '../today/blockEdits';
import { formatDateLabel } from './weekFormat';

interface DayPeekSheetProps {
  date: string;
  weekday: Weekday;
  blocks: DayBlock[];
  onClose: () => void;
}

/** SH5 — a past day, tapped from Week: read-only, done items only, no accounting of the rest. */
export function DayPeekSheet({ date, weekday, blocks, onClose }: DayPeekSheetProps) {
  const doneBlocks = activeBlocks(blocks).filter((block) => block.status === 'done');

  return (
    <SheetContainer title={`${WEEKDAY_LABELS[weekday]} · ${formatDateLabel(date)}`} onClose={onClose}>
      {doneBlocks.length > 0 ? (
        doneBlocks.map((block) => (
          <DoneListRow key={block.id} title={block.title} slim={doneBlocks.length > 5} />
        ))
      ) : (
        <div className="ss-daypeek-empty">A quiet day.</div>
      )}
    </SheetContainer>
  );
}
