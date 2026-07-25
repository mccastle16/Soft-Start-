import type { PointerEvent as ReactPointerEvent } from 'react';
import type { DayBlock } from '../../types';
import { CategoryTag } from './CategoryTag';
import { formatTimeRange } from './timelineMath';

interface BlockCardProps {
  block: DayBlock;
  top: number;
  height: number;
  condensed: boolean;
  isCurrent: boolean;
  isDragging?: boolean;
  isOverlapping?: boolean;
  onBodyPointerDown: (clientY: number) => void;
  onHandlePointerDown?: (clientY: number) => void;
  onTimeTap: () => void;
}

export function BlockCard({
  block,
  top,
  height,
  condensed,
  isCurrent,
  isDragging = false,
  isOverlapping = false,
  onBodyPointerDown,
  onHandlePointerDown,
  onTimeTap,
}: BlockCardProps) {
  const tierClass =
    block.tier === 'anchored' ? 'ss-block--anchor' : block.tier === 'protected' ? 'ss-block--soft' : '';
  const isDone = block.status === 'done';
  const showHandle = block.tier !== 'anchored' && !isDone;

  const className = [
    'ss-block',
    tierClass,
    isDone ? 'ss-block--done' : '',
    isCurrent && !isDone ? 'ss-block--current' : '',
    condensed ? 'ss-block--condensed' : '',
    showHandle ? 'ss-block--movable' : '',
    isDragging ? 'ss-block--dragging' : '',
    isOverlapping ? 'ss-block--warm' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const timeLabel =
    formatTimeRange(block.startMinute, block.endMinute) + (block.tier === 'anchored' ? ' · anchored' : '');

  function handleBodyPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== undefined && event.button !== 0) return;
    onBodyPointerDown(event.clientY);
  }

  function handleTimeClick(event: ReactPointerEvent<HTMLSpanElement>) {
    event.stopPropagation();
    onTimeTap();
  }

  function handleGrabPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.stopPropagation();
    onHandlePointerDown?.(event.clientY);
  }

  const timeProps = {
    className: 'ss-block-time ss-block-time--editable',
    onClick: handleTimeClick,
    onPointerDown: (event: ReactPointerEvent<HTMLSpanElement>) => event.stopPropagation(),
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `Edit time, currently ${timeLabel}`,
  };

  // No room for the handle pill at the condensed floor without it colliding with the time line —
  // press-and-drag the card itself to reorder there instead (see the pending→reorder escalation in TimelineView).
  const grab = showHandle && !condensed && (
    <div className="ss-grab" onPointerDown={handleGrabPointerDown} aria-label="Move block" role="button" tabIndex={-1} />
  );

  if (condensed) {
    return (
      <div className={className} style={{ top, height }} onPointerDown={handleBodyPointerDown}>
        <span className="ss-block-title">{block.title}</span>
        <span {...timeProps}>{timeLabel}</span>
      </div>
    );
  }

  return (
    <div className={className} style={{ top, height }} onPointerDown={handleBodyPointerDown}>
      <div className="ss-block-row">
        <span className="ss-block-title">{block.title}</span>
        <CategoryTag category={block.category} tier={block.tier} status={block.status} />
      </div>
      <span {...timeProps}>{timeLabel}</span>
      {grab}
    </div>
  );
}
