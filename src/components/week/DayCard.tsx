import { AddPill } from '../today/AddPill';
import { activeBlocks } from '../today/blockEdits';
import { IconButton } from '../today/IconButton';
import { PlusIcon } from '../today/icons';
import { WEEKDAY_LABELS } from '../../lib/weekdayLabels';
import type { DayBlock, Weekday } from '../../types';
import { MiniBlockMarks } from './MiniBlockMarks';
import { dayOfMonth, formatShowedUpLine } from './weekFormat';

export type DayTemperature = 'past' | 'today' | 'future';

interface DayCardProps {
  date: string;
  weekday: Weekday;
  blocks: DayBlock[];
  temperature: DayTemperature;
  onAdd: () => void;
  onOpen: () => void;
}

/** S2's four card temperatures: past (recedes, sage-only), today (shadow-lift + blush tag), future (rose-and-cream preview), weekend-open (blush gradient invite). */
export function DayCard({ date, weekday, blocks, temperature, onAdd, onOpen }: DayCardProps) {
  const weekdayLabel = WEEKDAY_LABELS[weekday];
  const visible = activeBlocks(blocks);
  const isWeekend = weekday === 'saturday' || weekday === 'sunday';

  if (temperature !== 'past' && isWeekend && visible.length === 0) {
    return (
      <div className="ss-day ss-day--weekend" onClick={onOpen} role="button" tabIndex={0}>
        <div className="ss-day-row">
          <span className="ss-dayname">
            {weekdayLabel}
            <span className="ss-daydate">{dayOfMonth(date)}</span>
          </span>
          {temperature === 'today' && (
            <span className="ss-day-tag ss-day-tag--today">
              <span className="ss-day-dot" />
              Today
            </span>
          )}
        </div>
        <div className="ss-day-wkopen">Wide open.</div>
        <div onClick={(e) => e.stopPropagation()}>
          <AddPill onClick={onAdd} />
        </div>
      </div>
    );
  }

  if (temperature === 'past') {
    const doneBlocks = visible.filter((block) => block.status === 'done');
    return (
      <div className="ss-day ss-day--past" onClick={onOpen} role="button" tabIndex={0}>
        <div className="ss-day-row">
          <span className="ss-dayname">
            {weekdayLabel}
            <span className="ss-daydate">{dayOfMonth(date)}</span>
          </span>
          {doneBlocks.length > 0 && (
            <span className="ss-day-tag ss-day-tag--done">
              <span className="ss-day-dot" />
              {doneBlocks.length} done
            </span>
          )}
        </div>
        {doneBlocks.length > 0 && (
          <>
            <MiniBlockMarks blocks={doneBlocks} />
            <div className="ss-day-doneline">{formatShowedUpLine(doneBlocks.length)}</div>
          </>
        )}
      </div>
    );
  }

  const doneCount = visible.filter((block) => block.status === 'done').length;

  return (
    <div className={`ss-day ${temperature === 'today' ? 'ss-day--today' : ''}`.trim()} onClick={onOpen} role="button" tabIndex={0}>
      <div className="ss-day-row">
        <span className="ss-dayname">
          {weekdayLabel}
          <span className="ss-daydate">{dayOfMonth(date)}</span>
        </span>
        <span className="ss-day-row-actions">
          {temperature === 'today' && (
            <span className="ss-day-tag ss-day-tag--today">
              <span className="ss-day-dot" />
              Today · {doneCount}/{visible.length}
            </span>
          )}
          <span onClick={(e) => e.stopPropagation()}>
            <IconButton label={`Add to ${weekdayLabel}`} icon={<PlusIcon />} size="sm" onClick={onAdd} />
          </span>
        </span>
      </div>
      <MiniBlockMarks blocks={visible} />
    </div>
  );
}
