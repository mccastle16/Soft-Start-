import { useState } from 'react';
import './FirstRun.css';
import '../today/Today.css';
import '../arrival/Arrival.css';
import { GhostButton } from '../arrival/GhostButton';
import { PrimaryButton } from '../arrival/PrimaryButton';
import { hasNonAnchoredBlocks } from '../../lib/firstRun';
import { WEEKDAY_LABELS, WEEKDAY_SHORT_LABELS } from '../../lib/weekdayLabels';
import type { DayTemplate, Weekday } from '../../types';
import { WEEKDAYS } from '../../types';
import { DayPicker, type DayChipState } from './DayPicker';
import { Stepper } from './Stepper';

interface RepeatDayScreenProps {
  sourceWeekday: Weekday;
  templates: DayTemplate[];
  onCopy: (selectedDays: Weekday[]) => void;
  onSkip: () => void;
}

/** "Covered" means already built (has real content), not merely holding one of S0.3's anchors. */
function coveredWeekdays(templates: DayTemplate[], exclude: Weekday): Weekday[] {
  const templatesByDay = new Map(templates.map((t) => [t.weekday, t]));
  return WEEKDAYS.filter((day) => day !== exclude && hasNonAnchoredBlocks(templatesByDay.get(day)?.blocks ?? []));
}

function formatRepeatHint(source: Weekday, templates: DayTemplate[]): string {
  const covered = coveredWeekdays(templates, source);
  if (covered.length === 0) {
    return 'Anchored meetings stay on their days either way. Weekends stay blank unless you choose them.';
  }
  const open = WEEKDAYS.filter((day) => day !== source && !covered.includes(day));
  const coveredLabel = covered.map((d) => WEEKDAY_SHORT_LABELS[d]).join(', ');
  const openLabel = open.map((d) => WEEKDAY_SHORT_LABELS[d]).join(', ');
  const sourceLabel = WEEKDAY_LABELS[source];
  const parts = [`${coveredLabel} already ${covered.length === 1 ? 'carries' : 'carry'} ${sourceLabel}'s plan`, `${sourceLabel} is the source`];
  if (open.length > 0) parts.push(`${openLabel} ${open.length === 1 ? 'is' : 'are'} open`);
  return `${parts.join('; ')}.`;
}

/** S0.5 / S0.5c — every built day earns a repeat step: copy it onto still-empty days, or move on. */
export function RepeatDayScreen({ sourceWeekday, templates, onCopy, onSkip }: RepeatDayScreenProps) {
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
  const covered = coveredWeekdays(templates, sourceWeekday);
  const sourceLabel = WEEKDAY_LABELS[sourceWeekday];

  const dayStates: Record<Weekday, DayChipState> = Object.fromEntries(
    WEEKDAYS.map((day) => {
      if (day === sourceWeekday) return [day, 'source'];
      if (covered.includes(day)) return [day, 'covered'];
      return [day, selectedDays.includes(day) ? 'selected' : 'unselected'];
    }),
  ) as Record<Weekday, DayChipState>;

  function toggleDay(day: Weekday) {
    if (day === sourceWeekday || covered.includes(day)) return;
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  return (
    <div className="ss-screen">
      <Stepper activeCount={5} />
      <div className="ss-fr-h2">
        {sourceLabel}'s ready.
        <br />
        Repeat it on other days?
      </div>
      <div className="ss-fr-sub">Tap the days that should start from {sourceLabel}'s plan — each one stays editable on its own.</div>

      <DayPicker states={dayStates} onToggle={toggleDay} />
      <div className="ss-fr-hint">{formatRepeatHint(sourceWeekday, templates)}</div>

      <div className="ss-arrival-spacer" />
      <PrimaryButton disabled={selectedDays.length === 0} onClick={() => onCopy(selectedDays)}>
        Copy {sourceLabel} to selected
      </PrimaryButton>
      <GhostButton onClick={onSkip}>{sourceWeekday === 'monday' ? "I'll build each day fresh" : `Just ${sourceLabel} is fine`}</GhostButton>
    </div>
  );
}
