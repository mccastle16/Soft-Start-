import { useState } from 'react';
import { TimeEditPopover } from '../today/TimeEditPopover';
import { formatTimeRange } from '../today/timelineMath';
import { CategoryPicker } from '../sheets/CategoryPicker';
import { SheetContainer } from '../sheets/SheetContainer';
import { TimeRow } from '../sheets/TimeRow';
import type { BlockCategory, BlockTier, TemplateBlock } from '../../types';
import { DEFAULT_MIN_DURATION_MINUTES } from '../../types';

interface TemplateBlockSheetProps {
  /** Absent when adding a brand-new block. */
  block?: TemplateBlock;
  defaultStartMinute: number;
  defaultEndMinute: number;
  onSave: (block: TemplateBlock) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const TIER_LABELS: Record<BlockTier, string> = { anchored: 'Anchored', protected: 'Protected', flexible: 'Flexible' };
const TIERS: readonly BlockTier[] = ['flexible', 'protected', 'anchored'];

/** The S0.4/S3.1 shared editor's add-or-edit form: title, category, times, tier, minimum duration. */
export function TemplateBlockSheet({
  block,
  defaultStartMinute,
  defaultEndMinute,
  onSave,
  onDelete,
  onClose,
}: TemplateBlockSheetProps) {
  const [title, setTitle] = useState(block?.title ?? '');
  const [category, setCategory] = useState<BlockCategory>(block?.category ?? 'other');
  const [tier, setTier] = useState<BlockTier>(block?.tier ?? 'flexible');
  const [minDuration, setMinDuration] = useState(block?.minDurationMinutes ?? DEFAULT_MIN_DURATION_MINUTES);
  const [startMinute, setStartMinute] = useState(block?.startMinute ?? defaultStartMinute);
  const [endMinute, setEndMinute] = useState(block?.endMinute ?? defaultEndMinute);
  const [editingTime, setEditingTime] = useState(false);

  function handleSave() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || endMinute <= startMinute) return;
    onSave({
      id: block?.id ?? crypto.randomUUID(),
      title: trimmedTitle,
      category,
      tier,
      startMinute,
      endMinute,
      minDurationMinutes: tier === 'anchored' ? undefined : minDuration,
    });
  }

  return (
    <SheetContainer title={block ? 'Edit block' : 'Add a block'} onClose={onClose}>
      <input
        type="text"
        className="ss-sheet-field"
        placeholder="What is it?"
        value={title}
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="ss-sheet-edit-label">Category</div>
      <CategoryPicker selected={category} onSelect={setCategory} />

      <div className="ss-sheet-edit-label">Tier</div>
      <div className="ss-sheet-cats">
        {TIERS.map((t) => (
          <button
            key={t}
            type="button"
            className={`ss-sheet-cat ${t === tier ? 'ss-sheet-cat--sel' : ''}`.trim()}
            onClick={() => setTier(t)}
            aria-pressed={t === tier}
          >
            {TIER_LABELS[t]}
          </button>
        ))}
      </div>

      {tier !== 'anchored' && (
        <>
          <div className="ss-sheet-edit-label">Minimum duration (minutes)</div>
          <input
            type="number"
            step={5}
            min={5}
            className="ss-sheet-field"
            value={minDuration}
            onChange={(e) => setMinDuration(Math.max(5, Number(e.target.value) || 5))}
          />
        </>
      )}

      <div className="ss-sheet-edit-label">Times</div>
      {editingTime ? (
        <TimeEditPopover
          startMinute={startMinute}
          endMinute={endMinute}
          onCancel={() => setEditingTime(false)}
          onConfirm={(newStart, newEnd) => {
            setStartMinute(newStart);
            setEndMinute(newEnd);
            setEditingTime(false);
          }}
        />
      ) : (
        <TimeRow label={formatTimeRange(startMinute, endMinute)} hint="tap to change" onClick={() => setEditingTime(true)} />
      )}

      <div className="ss-sheet-edit-actions">
        <button type="button" className="ss-sheet-btn ss-sheet-btn--done" onClick={handleSave}>
          Save
        </button>
        {onDelete && (
          <button type="button" className="ss-sheet-btn ss-sheet-btn--ghost" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </SheetContainer>
  );
}
