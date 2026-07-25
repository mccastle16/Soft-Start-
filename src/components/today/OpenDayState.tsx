import { AddPill } from './AddPill';

interface OpenDayStateProps {
  weekdayLabel: string;
  onAdd: () => void;
}

/** Blank weekends (and any fully-rested weekday) land here — an invitation, never an error. */
export function OpenDayState({ weekdayLabel, onAdd }: OpenDayStateProps) {
  return (
    <div className="ss-open-day">
      <div className="ss-open-day-title">Your {weekdayLabel} is wide open.</div>
      <AddPill onClick={onAdd} />
    </div>
  );
}
