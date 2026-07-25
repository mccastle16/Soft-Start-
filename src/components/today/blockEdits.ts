import type { DayBlock } from '../../types';
import { DEFAULT_MIN_DURATION_MINUTES } from '../../types';

export const SNAP_MINUTES = 5;

export function snapMinutes(raw: number): number {
  return Math.round(raw / SNAP_MINUTES) * SNAP_MINUTES;
}

export function toInputValue(minute: number): string {
  const normalized = ((minute % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60)
    .toString()
    .padStart(2, '0');
  const min = (normalized % 60).toString().padStart(2, '0');
  return `${hour}:${min}`;
}

/** Reattaches the typed clock time to whichever day-index (today, or after the midnight rollover) the original minute belonged to. */
export function fromInputValue(value: string, referenceMinute: number): number {
  const [hour, min] = value.split(':').map(Number);
  const dayIndex = Math.floor(referenceMinute / 1440);
  return dayIndex * 1440 + hour * 60 + min;
}

export function blockMinDuration(block: DayBlock): number {
  return block.minDurationMinutes ?? DEFAULT_MIN_DURATION_MINUTES;
}

export function sortByStart(blocks: DayBlock[]): DayBlock[] {
  return [...blocks].sort((a, b) => a.startMinute - b.startMinute);
}

interface MovableRegion {
  lo: number;
  hi: number;
  lowerBound: number;
  upperBound: number;
}

/**
 * The contiguous run of non-anchored blocks (in sorted order) containing
 * `index`, and the fixed minute bounds it's sandwiched between. Anchored
 * blocks never move, so they're the walls a reorder can slide up against
 * but never cross.
 */
export function getMovableRegion(
  sorted: DayBlock[],
  index: number,
  dayStartMinute: number,
  dayEndMinute: number,
): MovableRegion {
  let lo = index;
  let hi = index;
  while (lo - 1 >= 0 && sorted[lo - 1].tier !== 'anchored') lo--;
  while (hi + 1 < sorted.length && sorted[hi + 1].tier !== 'anchored') hi++;
  const lowerBound = lo === 0 ? dayStartMinute : sorted[lo - 1].endMinute;
  const upperBound = hi === sorted.length - 1 ? dayEndMinute : sorted[hi + 1].startMinute;
  return { lo, hi, lowerBound, upperBound };
}

/** Packs `orderedIds` back-to-back starting at `lowerBound`, preserving each block's own duration. */
function repackRegion(blocksById: Map<string, DayBlock>, orderedIds: string[], lowerBound: number): DayBlock[] {
  let cursor = lowerBound;
  return orderedIds.map((id) => {
    const block = blocksById.get(id)!;
    const duration = block.endMinute - block.startMinute;
    const startMinute = cursor;
    const endMinute = startMinute + duration;
    cursor = endMinute;
    return { ...block, startMinute, endMinute };
  });
}

/**
 * Reorders a movable block among its region-mates (the run of non-anchored
 * blocks it lives among) by where it's been dragged to, in minutes. Everyone
 * in the region gets repacked back-to-back in the new order, so total
 * duration — and therefore the day's start/end — never changes. This is
 * "silent" reorder (edge 22): no note, no confirmation, ever.
 */
export function reorderBlock(
  allBlocks: DayBlock[],
  draggedId: string,
  draggedCenterMinute: number,
  dayStartMinute: number,
  dayEndMinute: number,
): DayBlock[] {
  const sorted = sortByStart(allBlocks);
  const index = sorted.findIndex((block) => block.id === draggedId);
  if (index === -1) return allBlocks;

  const { lo, hi, lowerBound } = getMovableRegion(sorted, index, dayStartMinute, dayEndMinute);
  const regionBlocks = sorted.slice(lo, hi + 1);
  const others = regionBlocks.filter((block) => block.id !== draggedId);

  const insertAt = others.findIndex((block) => (block.startMinute + block.endMinute) / 2 > draggedCenterMinute);
  const otherIds = others.map((block) => block.id);
  const orderedIds =
    insertAt === -1
      ? [...otherIds, draggedId]
      : [...otherIds.slice(0, insertAt), draggedId, ...otherIds.slice(insertAt)];

  const blocksById = new Map(regionBlocks.map((block) => [block.id, block]));
  const repackedById = new Map(repackRegion(blocksById, orderedIds, lowerBound).map((block) => [block.id, block]));

  return allBlocks.map((block) => repackedById.get(block.id) ?? block);
}

export interface TimeChangeResult {
  blocks: DayBlock[];
  overlapNeighborId?: string;
  boundaryExceeded?: { newDayStartMinute?: number; newDayEndMinute?: number };
}

/**
 * Applies a start/end edit to one block (an edge-drag or a typed time),
 * flagging the two things that need a gentle question rather than resolving
 * them outright: a new overlap with its neighbor (N1), or a push past
 * today's bounds (N2). The caller decides what to do with those flags.
 */
export function applyTimeChange(
  allBlocks: DayBlock[],
  blockId: string,
  newStartMinute: number,
  newEndMinute: number,
  dayStartMinute: number,
  dayEndMinute: number,
): TimeChangeResult {
  const blocks = allBlocks.map((block) =>
    block.id === blockId ? { ...block, startMinute: newStartMinute, endMinute: newEndMinute } : block,
  );
  const sorted = sortByStart(blocks);
  const index = sorted.findIndex((block) => block.id === blockId);
  const prev = index > 0 ? sorted[index - 1] : undefined;
  const next = index < sorted.length - 1 ? sorted[index + 1] : undefined;

  let overlapNeighborId: string | undefined;
  if (next && newEndMinute > next.startMinute) overlapNeighborId = next.id;
  else if (prev && newStartMinute < prev.endMinute) overlapNeighborId = prev.id;

  let boundaryExceeded: TimeChangeResult['boundaryExceeded'];
  if (newStartMinute < dayStartMinute) boundaryExceeded = { newDayStartMinute: newStartMinute };
  else if (newEndMinute > dayEndMinute) boundaryExceeded = { newDayEndMinute: newEndMinute };

  return { blocks, overlapNeighborId, boundaryExceeded };
}

/** N1's one-tap fix: nudge the later of the two blocks forward, shrinking it toward its floor rather than moving the earlier one. */
export function resolveOverlap(allBlocks: DayBlock[], blockId: string, neighborId: string): DayBlock[] {
  const block = allBlocks.find((b) => b.id === blockId);
  const neighbor = allBlocks.find((b) => b.id === neighborId);
  if (!block || !neighbor) return allBlocks;

  const [earlier, later] = block.startMinute <= neighbor.startMinute ? [block, neighbor] : [neighbor, block];
  const minDuration = blockMinDuration(later);
  const newLaterStart = Math.min(earlier.endMinute, later.endMinute - minDuration);

  return allBlocks.map((b) => (b.id === later.id ? { ...b, startMinute: newLaterStart } : b));
}

export function detectOverlapId(allBlocks: DayBlock[], blockId: string): string | undefined {
  const sorted = sortByStart(allBlocks);
  const index = sorted.findIndex((block) => block.id === blockId);
  if (index === -1) return undefined;
  const block = sorted[index];
  const prev = index > 0 ? sorted[index - 1] : undefined;
  const next = index < sorted.length - 1 ? sorted[index + 1] : undefined;
  if (next && block.endMinute > next.startMinute) return next.id;
  if (prev && block.startMinute < prev.endMinute) return prev.id;
  return undefined;
}

/** Rested/moved blocks are gone from today's telling of the day (no backlog, ever) — everything else still renders. */
export function activeBlocks(blocks: DayBlock[]): DayBlock[] {
  return blocks.filter((block) => block.status !== 'resting' && block.status !== 'moved');
}

/** Tap-to-complete, and its quiet undo (mis-taps happen). */
export function toggleBlockDone(blocks: DayBlock[], blockId: string): DayBlock[] {
  return blocks.map((block) =>
    block.id === blockId ? { ...block, status: block.status === 'done' ? 'pending' : 'done' } : block,
  );
}

/** N2's bounds check alone, for callers (like the Add sheet) that aren't also re-checking overlap against a specific block. */
export function checkBoundary(
  newStartMinute: number,
  newEndMinute: number,
  dayStartMinute: number,
  dayEndMinute: number,
): { newDayStartMinute?: number; newDayEndMinute?: number } | undefined {
  if (newStartMinute < dayStartMinute) return { newDayStartMinute: newStartMinute };
  if (newEndMinute > dayEndMinute) return { newDayEndMinute: newEndMinute };
  return undefined;
}

const DEFAULT_ADD_DURATION_MINUTES = 60;
const OPEN_GAP_BUFFER_MINUTES = 5;

/**
 * SH2's default start/end: a 5-minute breather after the day's last block,
 * a tidy hour long, clamped inside today's bounds so the default itself
 * never needs to ask the N2 boundary question.
 */
export function nextOpenGap(
  blocks: DayBlock[],
  dayStartMinute: number,
  dayEndMinute: number,
): { startMinute: number; endMinute: number } {
  const lastEnd = blocks.length > 0 ? Math.max(...blocks.map((block) => block.endMinute)) : dayStartMinute;
  const start = Math.min(
    snapMinutes(Math.max(dayStartMinute, lastEnd + OPEN_GAP_BUFFER_MINUTES)),
    Math.max(dayStartMinute, dayEndMinute - DEFAULT_MIN_DURATION_MINUTES),
  );
  const end = Math.min(start + DEFAULT_ADD_DURATION_MINUTES, dayEndMinute);
  return { startMinute: start, endMinute: Math.max(end, start + DEFAULT_MIN_DURATION_MINUTES) };
}
