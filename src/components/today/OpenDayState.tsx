import { PlusIcon } from './icons';

interface OpenDayStateProps {
  weekdayLabel: string;
}

/** Blank weekends (and any fully-rested weekday) land here — an invitation, never an error. */
export function OpenDayState({ weekdayLabel }: OpenDayStateProps) {
  return (
    <div className="ss-open-day">
      <div className="ss-open-day-title">Your {weekdayLabel} is wide open.</div>
      <button type="button" className="ss-add-pill">
        <PlusIcon />
        Add something
      </button>
    </div>
  );
}
