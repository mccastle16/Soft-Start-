import { WEEKDAY_SHORT_LABELS } from '../../lib/weekdayLabels';
import { WEEKDAYS, type Weekday } from '../../types';

export type DayChipState = 'unselected' | 'selected' | 'source' | 'covered';

interface DayPickerProps {
  states: Record<Weekday, DayChipState>;
  onToggle: (weekday: Weekday) => void;
}

/** Seven day chips. Selection = rose fill, the only selection signal; source/covered days recess, unselectable. */
export function DayPicker({ states, onToggle }: DayPickerProps) {
  return (
    <div className="ss-fr-days">
      {WEEKDAYS.map((weekday) => {
        const state = states[weekday];
        const disabled = state === 'source' || state === 'covered';
        return (
          <button
            key={weekday}
            type="button"
            disabled={disabled}
            className={`ss-fr-dchip ss-fr-dchip--${state}`}
            onClick={() => onToggle(weekday)}
          >
            {WEEKDAY_SHORT_LABELS[weekday]}
          </button>
        );
      })}
    </div>
  );
}
