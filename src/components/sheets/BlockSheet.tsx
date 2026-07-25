import { useState } from 'react';
import { applyTimeChange, resolveOverlap } from '../../components/today/blockEdits';
import { InlineNote } from '../today/InlineNote';
import { CategoryTag } from '../today/CategoryTag';
import { TimeEditPopover } from '../today/TimeEditPopover';
import { formatClockWithMeridiem, formatTimeRange } from '../today/timelineMath';
import type { TodayPlanPatch } from '../../hooks/useTodayPlan';
import type { BlockCategory, BlockTier, DayBlock } from '../../types';
import { ActionRow } from './ActionRow';
import { CategoryPicker } from './CategoryPicker';
import { SheetContainer } from './SheetContainer';
import { TimeRow } from './TimeRow';
import { Toggle } from './Toggle';

interface BlockSheetProps {
  block: DayBlock;
  blocks: DayBlock[];
  dayStartMinute: number;
  dayEndMinute: number;
  onClose: () => void;
  onUpdatePlan: (patch: TodayPlanPatch) => void;
  onMoveToTomorrow: (block: DayBlock) => void;
  onRestToday: (blockId: string) => void;
  onAddToRhythm: (block: DayBlock) => void;
}

type PendingNote =
  | { kind: 'overlap'; neighborId: string }
  | {
      kind: 'boundary';
      blocks: DayBlock[];
      newDayStartMinute?: number;
      newDayEndMinute?: number;
      thenOverlapNeighborId?: string;
    };

const TIER_LABELS: Record<BlockTier, string> = { anchored: 'Anchored', protected: 'Protected', flexible: 'Flexible' };
const TIERS: readonly BlockTier[] = ['flexible', 'protected', 'anchored'];

/** SH1 — tap a block, get its whole quiet philosophy: Done, Move to tomorrow, Rest today, Edit block. */
export function BlockSheet({
  block,
  blocks,
  dayStartMinute,
  dayEndMinute,
  onClose,
  onUpdatePlan,
  onMoveToTomorrow,
  onRestToday,
  onAddToRhythm,
}: BlockSheetProps) {
  const [editingTime, setEditingTime] = useState(false);
  const [pendingNote, setPendingNote] = useState<PendingNote | null>(null);
  const [editingFields, setEditingFields] = useState(false);
  const [draftTitle, setDraftTitle] = useState(block.title);
  const [draftCategory, setDraftCategory] = useState<BlockCategory>(block.category);
  const [draftTier, setDraftTier] = useState<BlockTier>(block.tier);
  const [rhythmOn, setRhythmOn] = useState(false);

  const isDone = block.status === 'done';

  function handleDone() {
    onUpdatePlan({
      blocks: blocks.map((b) => (b.id === block.id ? { ...b, status: isDone ? 'pending' : 'done' } : b)),
    });
    onClose();
  }

  function handleMove() {
    onMoveToTomorrow(block);
    onClose();
  }

  function handleRest() {
    onRestToday(block.id);
    onClose();
  }

  function handleTimeConfirm(newStart: number, newEnd: number) {
    setEditingTime(false);
    const result = applyTimeChange(blocks, block.id, newStart, newEnd, dayStartMinute, dayEndMinute);
    if (result.boundaryExceeded) {
      setPendingNote({
        kind: 'boundary',
        blocks: result.blocks,
        newDayStartMinute: result.boundaryExceeded.newDayStartMinute,
        newDayEndMinute: result.boundaryExceeded.newDayEndMinute,
        thenOverlapNeighborId: result.overlapNeighborId,
      });
      return;
    }
    if (result.overlapNeighborId) {
      onUpdatePlan({ blocks: result.blocks });
      setPendingNote({ kind: 'overlap', neighborId: result.overlapNeighborId });
      return;
    }
    onUpdatePlan({ blocks: result.blocks });
  }

  function handleBoundaryConfirm() {
    if (pendingNote?.kind !== 'boundary') return;
    onUpdatePlan({
      blocks: pendingNote.blocks,
      dayStartMinute: pendingNote.newDayStartMinute ?? dayStartMinute,
      dayEndMinute: pendingNote.newDayEndMinute ?? dayEndMinute,
    });
    setPendingNote(
      pendingNote.thenOverlapNeighborId ? { kind: 'overlap', neighborId: pendingNote.thenOverlapNeighborId } : null,
    );
  }

  function handleOverlapNudge() {
    if (pendingNote?.kind !== 'overlap') return;
    onUpdatePlan({ blocks: resolveOverlap(blocks, block.id, pendingNote.neighborId) });
    setPendingNote(null);
  }

  function handleSaveEdit() {
    const title = draftTitle.trim();
    onUpdatePlan({
      blocks: blocks.map((b) => (b.id === block.id ? { ...b, title: title || b.title, category: draftCategory, tier: draftTier } : b)),
    });
    if (rhythmOn) {
      onAddToRhythm({ ...block, title: title || block.title, category: draftCategory, tier: draftTier });
    }
    onClose();
  }

  return (
    <SheetContainer
      title={block.title}
      headerAccessory={<CategoryTag category={block.category} tier={block.tier} status={block.status} />}
      onClose={onClose}
    >
      {editingTime ? (
        <TimeEditPopover
          startMinute={block.startMinute}
          endMinute={block.endMinute}
          onCancel={() => setEditingTime(false)}
          onConfirm={handleTimeConfirm}
        />
      ) : (
        <TimeRow
          label={formatTimeRange(block.startMinute, block.endMinute)}
          hint="tap to change"
          onClick={() => setEditingTime(true)}
        />
      )}

      {pendingNote?.kind === 'overlap' && (
        <InlineNote
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
          message={
            <>
              <b>Are you sure?</b> This will{' '}
              {pendingNote.newDayStartMinute !== undefined
                ? `start your day at ${formatClockWithMeridiem(pendingNote.newDayStartMinute)}`
                : `extend your day to ${formatClockWithMeridiem(pendingNote.newDayEndMinute!)}`}
              .
            </>
          }
          primaryLabel="Confirm"
          onPrimary={handleBoundaryConfirm}
          secondaryLabel="Put it back"
          onSecondary={() => setPendingNote(null)}
        />
      )}

      <ActionRow
        primaryLabel={isDone ? 'Undo done' : 'Done'}
        onPrimary={handleDone}
        secondary={[
          { label: 'Move to tomorrow', onClick: handleMove },
          { label: 'Rest today', onClick: handleRest },
        ]}
        ghostLabel={editingFields ? undefined : 'Edit block · title, category, tier'}
        onGhost={editingFields ? undefined : () => setEditingFields(true)}
      />

      {editingFields && (
        <div className="ss-sheet-edit">
          <input
            type="text"
            className="ss-sheet-field"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            aria-label="Block title"
          />
          <div className="ss-sheet-edit-label">Category</div>
          <CategoryPicker selected={draftCategory} onSelect={setDraftCategory} />
          <div className="ss-sheet-edit-label">Tier</div>
          <div className="ss-sheet-cats">
            {TIERS.map((tier) => (
              <button
                key={tier}
                type="button"
                className={`ss-sheet-cat ${tier === draftTier ? 'ss-sheet-cat--sel' : ''}`.trim()}
                onClick={() => setDraftTier(tier)}
                aria-pressed={tier === draftTier}
              >
                {TIER_LABELS[tier]}
              </button>
            ))}
          </div>
          {block.isOneOff && (
            <Toggle on={rhythmOn} onChange={setRhythmOn} label="Also add to my weekly rhythm" />
          )}
          <div className="ss-sheet-edit-actions">
            <button type="button" className="ss-sheet-btn ss-sheet-btn--done" onClick={handleSaveEdit}>
              Save
            </button>
            <button type="button" className="ss-sheet-btn ss-sheet-btn--ghost" onClick={() => setEditingFields(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </SheetContainer>
  );
}
