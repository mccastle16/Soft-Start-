import { useState } from 'react';
import './FirstRun.css';
import '../today/Today.css';
import '../arrival/Arrival.css';
import { PrimaryButton } from '../arrival/PrimaryButton';
import { SingleTimeEditPopover } from '../today/SingleTimeEditPopover';
import { TimeEditPopover } from '../today/TimeEditPopover';
import { formatClockWithMeridiem, formatTimeRange } from '../today/timelineMath';
import type { DayShape } from '../../types';
import { SettingsRow } from './SettingsRow';
import { Stepper } from './Stepper';

interface DayShapeScreenProps {
  dayShape: DayShape;
  onContinue: (dayShape: DayShape) => void;
}

type EditingField = 'dayStart' | 'activeStart' | 'lunch' | 'dayEnd' | null;

/** S0.2 — the four user-owned day-shape values, confirmed once, untouched by the app forever after. */
export function DayShapeScreen({ dayShape, onContinue }: DayShapeScreenProps) {
  const [shape, setShape] = useState(dayShape);
  const [editing, setEditing] = useState<EditingField>(null);

  return (
    <div className="ss-screen">
      <Stepper activeCount={2} />
      <div className="ss-fr-h2">The shape of your day</div>
      <div className="ss-fr-sub">Change any of these whenever you like — for the week, or for a single day.</div>

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

      <div className="ss-arrival-spacer" />
      <PrimaryButton onClick={() => onContinue(shape)}>Looks right</PrimaryButton>
    </div>
  );
}
