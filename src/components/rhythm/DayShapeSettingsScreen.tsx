import { useState } from 'react';
import '../firstrun/FirstRun.css';
import { updateSettings } from '../../db/repository';
import type { DayShape } from '../../types';
import { PrimaryButton } from '../arrival/PrimaryButton';
import { AppWordmark } from '../today/AppWordmark';
import { ScreenHeader } from '../today/ScreenHeader';
import { SingleTimeEditPopover } from '../today/SingleTimeEditPopover';
import { TimeEditPopover } from '../today/TimeEditPopover';
import { ChevronLeftIcon } from '../today/icons';
import { formatClockWithMeridiem, formatTimeRange } from '../today/timelineMath';
import { SettingsRow } from '../firstrun/SettingsRow';

interface DayShapeSettingsScreenProps {
  dayShape: DayShape;
  onBack: () => void;
}

type EditingField = 'dayStart' | 'activeStart' | 'lunch' | 'dayEnd' | null;

/** S3.2 — the same four user-owned values from first-run S0.2, editable globally anytime; the app never adjusts them on its own (§6.1). */
export function DayShapeSettingsScreen({ dayShape, onBack }: DayShapeSettingsScreenProps) {
  const [shape, setShape] = useState(dayShape);
  const [editing, setEditing] = useState<EditingField>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateSettings({ dayShape: shape });
    setSaving(false);
    onBack();
  }

  return (
    <div className="ss-screen ss-rhythm-enter">
      <AppWordmark />
      <button type="button" className="ss-back-row" onClick={onBack}>
        <ChevronLeftIcon />
        <span>Rhythm</span>
      </button>

      <ScreenHeader title="Day shape" subtitle="Applies from tomorrow" />

      <SettingsRow
        variant="value"
        label="Day starts · ease in"
        value={formatClockWithMeridiem(shape.dayStartMinute)}
        onClick={() => setEditing('dayStart')}
      />
      {editing === 'dayStart' && (
        <SingleTimeEditPopover
          minute={shape.dayStartMinute}
          onCancel={() => setEditing(null)}
          onConfirm={(minute) => {
            setShape((s) => ({ ...s, dayStartMinute: minute }));
            setEditing(null);
          }}
        />
      )}

      <SettingsRow
        variant="value"
        label="Active blocks begin"
        value={formatClockWithMeridiem(shape.activeStartMinute)}
        onClick={() => setEditing('activeStart')}
      />
      {editing === 'activeStart' && (
        <SingleTimeEditPopover
          minute={shape.activeStartMinute}
          onCancel={() => setEditing(null)}
          onConfirm={(minute) => {
            setShape((s) => ({ ...s, activeStartMinute: minute }));
            setEditing(null);
          }}
        />
      )}

      <SettingsRow
        variant="value"
        label="Lunch"
        value={formatTimeRange(shape.lunchStartMinute, shape.lunchStartMinute + shape.lunchDurationMinutes)}
        onClick={() => setEditing('lunch')}
      />
      {editing === 'lunch' && (
        <TimeEditPopover
          startMinute={shape.lunchStartMinute}
          endMinute={shape.lunchStartMinute + shape.lunchDurationMinutes}
          onCancel={() => setEditing(null)}
          onConfirm={(newStart, newEnd) => {
            setShape((s) => ({ ...s, lunchStartMinute: newStart, lunchDurationMinutes: newEnd - newStart }));
            setEditing(null);
          }}
        />
      )}

      <SettingsRow
        variant="value"
        label="Day ends"
        value={formatClockWithMeridiem(shape.dayEndMinute)}
        onClick={() => setEditing('dayEnd')}
      />
      {editing === 'dayEnd' && (
        <SingleTimeEditPopover
          minute={shape.dayEndMinute}
          onCancel={() => setEditing(null)}
          onConfirm={(minute) => {
            setShape((s) => ({ ...s, dayEndMinute: minute }));
            setEditing(null);
          }}
        />
      )}

      <div className="ss-fr-hint">
        Single days can differ — edit them in that day's template or in today's plan. The app never changes these on
        its own.
      </div>

      <div className="ss-arrival-spacer" />
      <PrimaryButton onClick={handleSave} disabled={saving}>
        Save changes
      </PrimaryButton>
    </div>
  );
}
