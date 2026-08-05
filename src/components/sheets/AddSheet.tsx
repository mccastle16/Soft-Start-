import { useState } from 'react';
import { checkBoundary, nextOpenGap } from '../today/blockEdits';
import { InlineNote } from '../today/InlineNote';
import { TimeEditPopover } from '../today/TimeEditPopover';
import { formatClockWithMeridiem, formatTimeRange } from '../today/timelineMath';
import type { BlockCategory, DayBlock } from '../../types';
import { CATEGORY_LABELS } from '../../types';
import { ActionRow } from './ActionRow';
import { CategoryPicker } from './CategoryPicker';
import { SheetContainer } from './SheetContainer';
import { TimeRow } from './TimeRow';
import { Toggle } from './Toggle';

interface AddSheetProps {
  blocks: DayBlock[];
  dayStartMinute: number;
  dayEndMinute: number;
  onClose: () => void;
  onAdd: (block: DayBlock, newDayStartMinute?: number, newDayEndMinute?: number) => void;
  onAddToRhythm: (block: DayBlock) => void;
}

interface BoundaryState {
  newDayStartMinute?: number;
  newDayEndMinute?: number;
  confirmed: boolean;
}

/** SH2 — from any "+". One-off by default; the rhythm toggle is the sole, deliberate path to permanence. */
export function AddSheet({ blocks, dayStartMinute, dayEndMinute, onClose, onAdd, onAddToRhythm }: AddSheetProps) {
  const defaultGap = nextOpenGap(blocks, dayStartMinute, dayEndMinute);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlockCategory>('other');
  const [startMinute, setStartMinute] = useState(defaultGap.startMinute);
  const [endMinute, setEndMinute] = useState(defaultGap.endMinute);
  const [editingTime, setEditingTime] = useState(false);
  const [boundary, setBoundary] = useState<BoundaryState | null>(null);
  const [rhythmOn, setRhythmOn] = useState(false);

  function handleCategorySelect(selected: BlockCategory) {
    setCategory(selected);
    if (selected !== 'other') setTitle(CATEGORY_LABELS[selected]);
  }

  function handleTimeConfirm(newStart: number, newEnd: number) {
    setEditingTime(false);
    setStartMinute(newStart);
    setEndMinute(newEnd);
    const result = checkBoundary(newStart, newEnd, dayStartMinute, dayEndMinute);
    setBoundary(result ? { ...result, confirmed: false } : null);
  }

  function handlePutItBack() {
    setStartMinute(defaultGap.startMinute);
    setEndMinute(defaultGap.endMinute);
    setBoundary(null);
  }

  function handleAdd() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    const block: DayBlock = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      category,
      tier: 'flexible',
      startMinute,
      endMinute,
      status: 'pending',
      isOneOff: true,
    };
    onAdd(block, boundary?.confirmed ? boundary.newDayStartMinute : undefined, boundary?.confirmed ? boundary.newDayEndMinute : undefined);
    if (rhythmOn) onAddToRhythm(block);
    onClose();
  }

  const awaitingBoundaryAnswer = boundary !== null && !boundary.confirmed;

  return (
    <SheetContainer title="Add something" onClose={onClose}>
      <input
        type="text"
        className="ss-sheet-field"
        placeholder="What are we adding?"
        value={title}
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
      />
      <CategoryPicker selected={category} onSelect={handleCategorySelect} />

      {editingTime ? (
        <TimeEditPopover
          startMinute={startMinute}
          endMinute={endMinute}
          onCancel={() => setEditingTime(false)}
          onConfirm={handleTimeConfirm}
        />
      ) : (
        <TimeRow
          label={formatTimeRange(startMinute, endMinute)}
          hint="next open gap"
          onClick={() => setEditingTime(true)}
        />
      )}

      {awaitingBoundaryAnswer && (
        <InlineNote
          message={
            <>
              <b>Are you sure?</b> This will{' '}
              {boundary!.newDayStartMinute !== undefined
                ? `start your day at ${formatClockWithMeridiem(boundary!.newDayStartMinute)}`
                : `extend your day to ${formatClockWithMeridiem(boundary!.newDayEndMinute!)}`}
              .
            </>
          }
          primaryLabel="Confirm"
          onPrimary={() => setBoundary((prev) => (prev ? { ...prev, confirmed: true } : prev))}
          secondaryLabel="Put it back"
          onSecondary={handlePutItBack}
        />
      )}

      <Toggle on={rhythmOn} onChange={setRhythmOn} label="Also add to my weekly rhythm" />

      {!awaitingBoundaryAnswer && (
        <ActionRow primaryLabel="Add to today" onPrimary={handleAdd} primaryDisabled={title.trim().length === 0} />
      )}
    </SheetContainer>
  );
}
