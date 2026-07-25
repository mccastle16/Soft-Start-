import { useState } from 'react';
import './FirstRun.css';
import '../today/Today.css';
import '../arrival/Arrival.css';
import '../sheets/Sheets.css';
import { GhostButton } from '../arrival/GhostButton';
import { PrimaryButton } from '../arrival/PrimaryButton';
import { CategoryPicker } from '../sheets/CategoryPicker';
import { SheetContainer } from '../sheets/SheetContainer';
import { TimeRow } from '../sheets/TimeRow';
import { TimeEditPopover } from '../today/TimeEditPopover';
import { formatTimeRange } from '../today/timelineMath';
import { PlusIcon } from '../today/icons';
import { WEEKDAY_SHORT_LABELS } from '../../lib/weekdayLabels';
import type { AnchorDraft } from '../../db/planGenerator';
import type { BlockCategory, Weekday } from '../../types';
import { WEEKDAYS } from '../../types';
import { DayPicker, type DayChipState } from './DayPicker';
import { Stepper } from './Stepper';

interface AnchorsScreenProps {
  onContinue: (anchors: AnchorDraft[]) => void;
}

interface DraftAnchor extends AnchorDraft {
  id: string;
}

function summarizeWeekdays(weekdays: Weekday[]): string {
  return WEEKDAYS.filter((w) => weekdays.includes(w))
    .map((w) => WEEKDAY_SHORT_LABELS[w])
    .join(' & ');
}

/** S0.3 — "Anything that happens at a fixed time?" Anchors get written straight into the days they apply to. */
export function AnchorsScreen({ onContinue }: AnchorsScreenProps) {
  const [anchors, setAnchors] = useState<DraftAnchor[]>([]);
  const [adding, setAdding] = useState(false);

  return (
    <div className="ss-screen">
      <Stepper activeCount={3} />
      <div className="ss-fr-h2">Anything that happens at a fixed time?</div>
      <div className="ss-fr-sub">Things like a standing meeting — anchored blocks never move during a re-flow.</div>

      {anchors.map((anchor) => (
        <div key={anchor.id} className="ss-fr-anchor-row">
          <div className="ss-fr-anchor-row-main">
            <span className="ss-fr-anchor-row-title">{anchor.title}</span>
            <span className="ss-fr-anchor-row-sub">
              {summarizeWeekdays(anchor.weekdays)} · {formatTimeRange(anchor.startMinute, anchor.endMinute)}
            </span>
          </div>
          <button
            type="button"
            className="ss-fr-anchor-remove"
            onClick={() => setAnchors((prev) => prev.filter((a) => a.id !== anchor.id))}
          >
            Remove
          </button>
        </div>
      ))}

      <button type="button" className="ss-fr-add-anchor-row" onClick={() => setAdding(true)}>
        <PlusIcon />
        Add a fixed time
      </button>

      <div className="ss-arrival-spacer" />
      <PrimaryButton onClick={() => onContinue(anchors)}>Continue</PrimaryButton>
      {anchors.length === 0 && <GhostButton onClick={() => onContinue(anchors)}>Nothing fixed</GhostButton>}

      {adding && (
        <AddAnchorSheet
          onClose={() => setAdding(false)}
          onAdd={(anchor) => {
            setAnchors((prev) => [...prev, { ...anchor, id: crypto.randomUUID() }]);
            setAdding(false);
          }}
        />
      )}
    </div>
  );
}

interface AddAnchorSheetProps {
  onClose: () => void;
  onAdd: (anchor: AnchorDraft) => void;
}

function AddAnchorSheet({ onClose, onAdd }: AddAnchorSheetProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlockCategory>('work');
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
  const [startMinute, setStartMinute] = useState(10 * 60);
  const [endMinute, setEndMinute] = useState(11 * 60);
  const [editingTime, setEditingTime] = useState(false);

  const dayStates: Record<Weekday, DayChipState> = Object.fromEntries(
    WEEKDAYS.map((day) => [day, selectedDays.includes(day) ? 'selected' : 'unselected']),
  ) as Record<Weekday, DayChipState>;

  function toggleDay(day: Weekday) {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed || selectedDays.length === 0) return;
    onAdd({ title: trimmed, category, weekdays: selectedDays, startMinute, endMinute });
  }

  return (
    <SheetContainer title="Add a fixed time" onClose={onClose}>
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
      <div className="ss-sheet-edit-label">Which days</div>
      <DayPicker states={dayStates} onToggle={toggleDay} />

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
        <button type="button" className="ss-sheet-btn ss-sheet-btn--done" onClick={handleAdd}>
          Add
        </button>
      </div>
    </SheetContainer>
  );
}
