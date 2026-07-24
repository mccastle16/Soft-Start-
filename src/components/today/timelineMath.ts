/** Pixels of vertical space per minute, given the lane's measured height and the day's bounds. */
export function getScale(dayStartMinute: number, dayEndMinute: number, heightPx: number): number {
  const totalMinutes = dayEndMinute - dayStartMinute;
  return totalMinutes > 0 ? heightPx / totalMinutes : 0;
}

export function minuteToOffset(minute: number, dayStartMinute: number, scale: number): number {
  return (minute - dayStartMinute) * scale;
}

/** Timeline blocks never render below the 44px touch-target minimum (edge case 21). */
export const MIN_BLOCK_HEIGHT_PX = 44;

/**
 * The smallest scale that still gives the day's shortest block at least
 * MIN_BLOCK_HEIGHT_PX. Using max(available-space scale, this) means a short
 * browser window makes the day scroll rather than shrinking every block down
 * to the condensed one-liner — condensed should mean "this block is
 * genuinely a few minutes long," not "the window is short today."
 */
export function getMinReadableScale(
  blocks: { startMinute: number; endMinute: number }[],
  minHeightPx: number,
): number {
  if (blocks.length === 0) return 0;
  const shortestDuration = Math.min(...blocks.map((block) => block.endMinute - block.startMinute));
  return shortestDuration > 0 ? minHeightPx / shortestDuration : 0;
}

export interface BlockLayout {
  top: number;
  height: number;
  condensed: boolean;
}

/**
 * Lays out blocks top-to-bottom, clamping any block below MIN_BLOCK_HEIGHT_PX
 * and pushing everything after it down to compensate. Pure proportional math
 * (top = (start - dayStart) * scale) can't guarantee that on its own — on a
 * short viewport, several blocks in a row can compute under the 44px floor,
 * and clamping each in isolation without shifting later blocks makes them
 * overlap. This keeps blocks proportional when there's room and stacks them
 * without collision when there isn't (the lane scrolls instead).
 */
export function layoutBlocks(
  blocks: { startMinute: number; endMinute: number }[],
  dayStartMinute: number,
  scale: number,
): BlockLayout[] {
  let lastBottom = 0;
  return blocks.map((block) => {
    const proportionalTop = minuteToOffset(block.startMinute, dayStartMinute, scale);
    const top = Math.max(proportionalTop, lastBottom);
    const rawHeight = (block.endMinute - block.startMinute) * scale;
    const condensed = rawHeight < MIN_BLOCK_HEIGHT_PX;
    const height = Math.max(rawHeight, MIN_BLOCK_HEIGHT_PX);
    lastBottom = top + height;
    return { top, height, condensed };
  });
}

/** Hour tick marks every 2 hours across the day's bounds, for the time gutter. */
export function getHourTicks(dayStartMinute: number, dayEndMinute: number): number[] {
  const ticks: number[] = [];
  for (let minute = dayStartMinute; minute < dayEndMinute; minute += 120) {
    ticks.push(minute);
  }
  return ticks;
}

/** "8 AM" for the first tick or a noon/midnight crossing, otherwise a bare hour like "10". */
export function formatHourLabel(minute: number, isFirst: boolean): string {
  const hourOfDay = Math.floor(minute / 60) % 24;
  const hour12 = hourOfDay % 12 === 0 ? 12 : hourOfDay % 12;
  const isNoonOrMidnight = hourOfDay % 12 === 0;
  if (isFirst || isNoonOrMidnight) {
    const meridiem = hourOfDay < 12 ? 'AM' : 'PM';
    return `${hour12} ${meridiem}`;
  }
  return `${hour12}`;
}

function formatClock(minute: number): string {
  const normalized = ((minute % 1440) + 1440) % 1440;
  const hourOfDay = Math.floor(normalized / 60);
  const minuteOfHour = normalized % 60;
  const hour12 = hourOfDay % 12 === 0 ? 12 : hourOfDay % 12;
  return `${hour12}:${minuteOfHour.toString().padStart(2, '0')}`;
}

export function formatTimeRange(startMinute: number, endMinute: number): string {
  return `${formatClock(startMinute)} – ${formatClock(endMinute)}`;
}
