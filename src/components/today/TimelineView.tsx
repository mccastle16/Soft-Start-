import type { DayBlock } from '../../types';
import { BlockCard } from './BlockCard';
import { NowMarker } from './NowMarker';
import { TimeGutter } from './TimeGutter';
import { MIN_BLOCK_HEIGHT_PX, getMinReadableScale, getScale, layoutBlocks } from './timelineMath';
import { useElementHeight } from './useElementHeight';

interface TimelineViewProps {
  dayStartMinute: number;
  dayEndMinute: number;
  blocks: DayBlock[];
  /** Minutes-since-midnight of "now"; omitted when there's nothing to mark (e.g. a future day's preview). */
  nowMinute?: number;
}

/** Block height maps to duration — the day's shape is readable at a glance. Scales to whatever vertical space it's given. */
export function TimelineView({ dayStartMinute, dayEndMinute, blocks, nowMinute }: TimelineViewProps) {
  const [laneRef, laneHeight] = useElementHeight<HTMLDivElement>();
  const sortedBlocks = [...blocks].sort((a, b) => a.startMinute - b.startMinute);

  const availableScale = laneHeight > 0 ? getScale(dayStartMinute, dayEndMinute, laneHeight) : 0;
  const minReadableScale = getMinReadableScale(sortedBlocks, MIN_BLOCK_HEIGHT_PX);
  const scale = Math.max(availableScale, minReadableScale);

  const layouts = scale > 0 ? layoutBlocks(sortedBlocks, dayStartMinute, scale) : [];

  return (
    <div className="ss-timeline">
      <TimeGutter dayStartMinute={dayStartMinute} dayEndMinute={dayEndMinute} scale={scale} />
      <div className="ss-lane" ref={laneRef}>
        {layouts.length > 0 &&
          sortedBlocks.map((block, index) => (
            <BlockCard
              key={block.id}
              block={block}
              top={layouts[index].top}
              height={layouts[index].height}
              condensed={layouts[index].condensed}
              isCurrent={nowMinute !== undefined && nowMinute >= block.startMinute && nowMinute < block.endMinute}
            />
          ))}
        {scale > 0 && nowMinute !== undefined && nowMinute >= dayStartMinute && nowMinute <= dayEndMinute && (
          <NowMarker minute={nowMinute} dayStartMinute={dayStartMinute} scale={scale} />
        )}
      </div>
    </div>
  );
}
