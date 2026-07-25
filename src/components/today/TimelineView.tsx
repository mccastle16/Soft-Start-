import { useEffect, useRef, useState } from 'react';
import type { TodayPlanPatch } from '../../hooks/useTodayPlan';
import type { DayBlock } from '../../types';
import { BlockCard } from './BlockCard';
import { applyTimeChange, reorderBlock, resolveOverlap, sortByStart } from './blockEdits';
import { InlineNote } from './InlineNote';
import { NowMarker } from './NowMarker';
import { TimeEditPopover } from './TimeEditPopover';
import { TimeGutter } from './TimeGutter';
import { formatClock, formatClockWithMeridiem, MIN_BLOCK_HEIGHT_PX, getMinReadableScale, getScale, layoutBlocks } from './timelineMath';
import { useElementHeight } from './useElementHeight';

interface TimelineViewProps {
  dayStartMinute: number;
  dayEndMinute: number;
  blocks: DayBlock[];
  /** Minutes-since-midnight of "now"; omitted when there's nothing to mark (e.g. a future day's preview). */
  nowMinute?: number;
  onUpdatePlan: (patch: TodayPlanPatch) => void;
  onOpenBlockSheet: (blockId: string) => void;
}

const DRAG_THRESHOLD_PX = 6;
const NOTE_GAP_PX = 8;

/** `pending` resolves to a done-toggle tap, or escalates to `reorder` once the drag threshold is crossed — the handle just starts `reorder` immediately. */
type PointerMode = 'pending' | 'reorder';

interface PointerState {
  blockId: string;
  mode: PointerMode;
  dragEligible: boolean;
  startClientY: number;
  currentClientY: number;
  originStartMinute: number;
  originEndMinute: number;
  originTop: number;
}

type PendingNote =
  | { kind: 'overlap'; blockId: string; neighborId: string }
  | {
      kind: 'boundary';
      blockId: string;
      blocks: DayBlock[];
      newDayStartMinute?: number;
      newDayEndMinute?: number;
      thenOverlapNeighborId?: string;
    };

/** Block height maps to duration — the day's shape is readable at a glance. Scales to whatever vertical space it's given. */
export function TimelineView({
  dayStartMinute,
  dayEndMinute,
  blocks,
  nowMinute,
  onUpdatePlan,
  onOpenBlockSheet,
}: TimelineViewProps) {
  const [laneRef, laneHeight] = useElementHeight<HTMLDivElement>();
  const [pointerState, setPointerState] = useState<PointerState | null>(null);
  const [pendingNote, setPendingNote] = useState<PendingNote | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const pointerStateRef = useRef<PointerState | null>(null);

  const sortedBlocks = sortByStart(blocks);
  const availableScale = laneHeight > 0 ? getScale(dayStartMinute, dayEndMinute, laneHeight) : 0;
  const minReadableScale = getMinReadableScale(sortedBlocks, MIN_BLOCK_HEIGHT_PX);
  const scale = Math.max(availableScale, minReadableScale);

  const isReordering = pointerState?.mode === 'reorder';

  const previewBlocks =
    isReordering && pointerState
      ? reorderBlock(
          blocks,
          pointerState.blockId,
          (pointerState.originStartMinute + pointerState.originEndMinute) / 2 +
            (pointerState.currentClientY - pointerState.startClientY) / scale,
          dayStartMinute,
          dayEndMinute,
        )
      : blocks;

  const previewSorted = sortByStart(previewBlocks);
  const layouts = scale > 0 ? layoutBlocks(previewSorted, dayStartMinute, scale) : [];

  function commitPlan(next: DayBlock[]) {
    onUpdatePlan({ blocks: next });
  }

  /** Feeds both the tap-to-edit-time popover and (were it ever added back) an edge-drag through the same overlap/boundary rules — edge 23. */
  function commitTimeChange(blockId: string, newStart: number, newEnd: number) {
    const result = applyTimeChange(blocks, blockId, newStart, newEnd, dayStartMinute, dayEndMinute);
    if (result.boundaryExceeded) {
      setPendingNote({
        kind: 'boundary',
        blockId,
        blocks: result.blocks,
        newDayStartMinute: result.boundaryExceeded.newDayStartMinute,
        newDayEndMinute: result.boundaryExceeded.newDayEndMinute,
        thenOverlapNeighborId: result.overlapNeighborId,
      });
      return;
    }
    if (result.overlapNeighborId) {
      commitPlan(result.blocks);
      setPendingNote({ kind: 'overlap', blockId, neighborId: result.overlapNeighborId });
      return;
    }
    commitPlan(result.blocks);
  }

  function commitInteraction(state: PointerState) {
    if (state.mode === 'pending') {
      onOpenBlockSheet(state.blockId);
      return;
    }
    const deltaY = state.currentClientY - state.startClientY;
    const centerMinute = (state.originStartMinute + state.originEndMinute) / 2 + deltaY / scale;
    commitPlan(reorderBlock(blocks, state.blockId, centerMinute, dayStartMinute, dayEndMinute));
  }

  useEffect(() => {
    if (!pointerState) return;

    function handleMove(e: PointerEvent) {
      const prev = pointerStateRef.current;
      if (!prev) return;
      const deltaY = e.clientY - prev.startClientY;
      const mode: PointerMode =
        prev.mode === 'pending' && prev.dragEligible && Math.abs(deltaY) > DRAG_THRESHOLD_PX ? 'reorder' : prev.mode;
      const next = { ...prev, currentClientY: e.clientY, mode };
      pointerStateRef.current = next;
      setPointerState(next);
    }

    function finish() {
      const prev = pointerStateRef.current;
      pointerStateRef.current = null;
      setPointerState(null);
      if (prev) commitInteraction(prev);
    }

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointerState !== null]);

  function startPointer(block: DayBlock, clientY: number, mode: PointerMode, originTop: number) {
    if (pointerStateRef.current || editingBlockId || pendingNote) return;
    const next: PointerState = {
      blockId: block.id,
      mode,
      dragEligible: mode === 'pending' && block.tier !== 'anchored' && block.status !== 'done',
      startClientY: clientY,
      currentClientY: clientY,
      originStartMinute: block.startMinute,
      originEndMinute: block.endMinute,
      originTop,
    };
    pointerStateRef.current = next;
    setPointerState(next);
  }

  function handleTimeTap(blockId: string) {
    if (pointerStateRef.current || pendingNote) return;
    setEditingBlockId(blockId);
  }

  function handleBoundaryConfirm() {
    if (pendingNote?.kind !== 'boundary') return;
    onUpdatePlan({
      blocks: pendingNote.blocks,
      dayStartMinute: pendingNote.newDayStartMinute ?? dayStartMinute,
      dayEndMinute: pendingNote.newDayEndMinute ?? dayEndMinute,
    });
    setPendingNote(
      pendingNote.thenOverlapNeighborId
        ? { kind: 'overlap', blockId: pendingNote.blockId, neighborId: pendingNote.thenOverlapNeighborId }
        : null,
    );
  }

  function handleOverlapNudge() {
    if (pendingNote?.kind !== 'overlap') return;
    commitPlan(resolveOverlap(blocks, pendingNote.blockId, pendingNote.neighborId));
    setPendingNote(null);
  }

  const layoutById = new Map(previewSorted.map((block, index) => [block.id, layouts[index]]));
  const noteAnchor = pendingNote ? layoutById.get(pendingNote.blockId) : undefined;
  const editAnchorBlock = editingBlockId ? blocks.find((b) => b.id === editingBlockId) : undefined;
  const editAnchorLayout = editingBlockId ? layoutById.get(editingBlockId) : undefined;

  return (
    <div className="ss-timeline">
      <TimeGutter dayStartMinute={dayStartMinute} dayEndMinute={dayEndMinute} scale={scale} />
      <div className="ss-lane" ref={laneRef}>
        {layouts.length > 0 &&
          previewSorted.map((block, index) => {
            const layout = layouts[index];
            const isThisDragging = isReordering && pointerState?.blockId === block.id;
            const top =
              isThisDragging && pointerState
                ? pointerState.originTop + (pointerState.currentClientY - pointerState.startClientY)
                : layout.top;
            const isOverlapping =
              pendingNote?.kind === 'overlap' &&
              (block.id === pendingNote.blockId || block.id === pendingNote.neighborId);

            return (
              <BlockCard
                key={block.id}
                block={block}
                top={top}
                height={layout.height}
                condensed={layout.condensed}
                isCurrent={nowMinute !== undefined && nowMinute >= block.startMinute && nowMinute < block.endMinute}
                isDragging={isThisDragging}
                isOverlapping={isOverlapping}
                onBodyPointerDown={(clientY) => startPointer(block, clientY, 'pending', layout.top)}
                onHandlePointerDown={(clientY) => startPointer(block, clientY, 'reorder', layout.top)}
                onTimeTap={() => handleTimeTap(block.id)}
              />
            );
          })}
        {scale > 0 && nowMinute !== undefined && nowMinute >= dayStartMinute && nowMinute <= dayEndMinute && (
          <NowMarker minute={nowMinute} dayStartMinute={dayStartMinute} scale={scale} />
        )}
        {pendingNote?.kind === 'overlap' && (
          <InlineNote
            top={(noteAnchor?.top ?? 0) + (noteAnchor?.height ?? 0) + NOTE_GAP_PX}
            message={
              <>
                <b>These two overlap</b> — want me to nudge one?
              </>
            }
            primaryLabel="Nudge it"
            onPrimary={handleOverlapNudge}
            secondaryLabel="Leave it"
            onSecondary={() => setPendingNote(null)}
          />
        )}
        {pendingNote?.kind === 'boundary' && (
          <InlineNote
            top={(noteAnchor?.top ?? 0) + (noteAnchor?.height ?? 0) + NOTE_GAP_PX}
            message={
              <>
                <b>Are you sure?</b> This will{' '}
                {pendingNote.newDayStartMinute !== undefined
                  ? `start your day at ${formatClockWithMeridiem(pendingNote.newDayStartMinute)}`
                  : `extend your day to ${formatClockWithMeridiem(pendingNote.newDayEndMinute!)}`}
                .
              </>
            }
            primaryLabel={
              pendingNote.newDayStartMinute !== undefined
                ? `Start at ${formatClock(pendingNote.newDayStartMinute)}`
                : `Extend to ${formatClock(pendingNote.newDayEndMinute!)}`
            }
            onPrimary={handleBoundaryConfirm}
            secondaryLabel="Put it back"
            onSecondary={() => setPendingNote(null)}
          />
        )}
        {editingBlockId && editAnchorBlock && (
          <TimeEditPopover
            top={(editAnchorLayout?.top ?? 0) + (editAnchorLayout?.height ?? 0) + NOTE_GAP_PX}
            startMinute={editAnchorBlock.startMinute}
            endMinute={editAnchorBlock.endMinute}
            onCancel={() => setEditingBlockId(null)}
            onConfirm={(newStart, newEnd) => {
              setEditingBlockId(null);
              commitTimeChange(editingBlockId, newStart, newEnd);
            }}
          />
        )}
      </div>
    </div>
  );
}
