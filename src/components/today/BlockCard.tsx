import type { DayBlock } from '../../types';
import { CategoryTag } from './CategoryTag';
import { formatTimeRange } from './timelineMath';

interface BlockCardProps {
  block: DayBlock;
  top: number;
  height: number;
  condensed: boolean;
  isCurrent: boolean;
}

export function BlockCard({ block, top, height, condensed, isCurrent }: BlockCardProps) {
  const tierClass =
    block.tier === 'anchored' ? 'ss-block--anchor' : block.tier === 'protected' ? 'ss-block--soft' : '';
  const isDone = block.status === 'done';
  const showGrab = block.tier === 'flexible' && !isDone;

  const className = [
    'ss-block',
    tierClass,
    isDone ? 'ss-block--done' : '',
    isCurrent && !isDone ? 'ss-block--current' : '',
    condensed ? 'ss-block--condensed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const timeLabel =
    formatTimeRange(block.startMinute, block.endMinute) + (block.tier === 'anchored' ? ' · anchored' : '');

  if (condensed) {
    return (
      <div className={className} style={{ top, height }}>
        <span className="ss-block-title">{block.title}</span>
        <span className="ss-block-time">{timeLabel}</span>
      </div>
    );
  }

  return (
    <div className={className} style={{ top, height }}>
      <div className="ss-block-row">
        <span className="ss-block-title">{block.title}</span>
        <CategoryTag category={block.category} tier={block.tier} status={block.status} />
      </div>
      <div className="ss-block-time">{timeLabel}</div>
      {showGrab && <div className="ss-grab" />}
    </div>
  );
}
