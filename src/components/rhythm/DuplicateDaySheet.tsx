import { useState } from 'react';
import { incrementTemplateEditsSinceBackup, getDayTemplate, saveDayTemplate } from '../../db/repository';
import { cloneTemplateBlocks } from '../../lib/firstRun';
import { WEEKDAY_LABELS } from '../../lib/weekdayLabels';
import { WEEKDAYS, type TemplateBlock, type Weekday } from '../../types';
import { DayPicker, type DayChipState } from '../firstrun/DayPicker';
import { SheetContainer } from '../sheets/SheetContainer';

interface DuplicateDaySheetProps {
  sourceWeekday: Weekday;
  sourceBlocks: TemplateBlock[];
  onClose: () => void;
}

/** S3.1's "Duplicate this day…" — same anchored-preserving copy rule as first-run's repeat step (RepeatDayScreen), just reachable anytime from Rhythm. */
export function DuplicateDaySheet({ sourceWeekday, sourceBlocks, onClose }: DuplicateDaySheetProps) {
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
  const [saving, setSaving] = useState(false);
  const sourceLabel = WEEKDAY_LABELS[sourceWeekday];

  const dayStates: Record<Weekday, DayChipState> = Object.fromEntries(
    WEEKDAYS.map((day) => {
      if (day === sourceWeekday) return [day, 'source'];
      return [day, selectedDays.includes(day) ? 'selected' : 'unselected'];
    }),
  ) as Record<Weekday, DayChipState>;

  function toggleDay(day: Weekday) {
    if (day === sourceWeekday) return;
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  async function handleCopy() {
    setSaving(true);
    const sourceNonAnchored = sourceBlocks.filter((block) => block.tier !== 'anchored');
    await Promise.all(
      selectedDays.map(async (day) => {
        const existing = await getDayTemplate(day);
        const dayAnchors = (existing?.blocks ?? []).filter((block) => block.tier === 'anchored');
        await saveDayTemplate({
          weekday: day,
          blocks: [...dayAnchors, ...cloneTemplateBlocks(sourceNonAnchored)],
          dayShapeOverride: existing?.dayShapeOverride,
        });
      }),
    );
    await incrementTemplateEditsSinceBackup();
    setSaving(false);
    onClose();
  }

  return (
    <SheetContainer title={`Duplicate ${sourceLabel}`} onClose={onClose}>
      <div className="ss-sheet-edit-label">Copy to</div>
      <DayPicker states={dayStates} onToggle={toggleDay} />
      <div className="ss-sheet-edit-actions">
        <button
          type="button"
          className="ss-sheet-btn ss-sheet-btn--done"
          disabled={selectedDays.length === 0 || saving}
          onClick={handleCopy}
        >
          Copy {sourceLabel} to selected
        </button>
      </div>
    </SheetContainer>
  );
}
