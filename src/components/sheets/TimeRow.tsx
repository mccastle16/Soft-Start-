import { ChevronRightIcon } from '../today/icons';

interface TimeRowProps {
  label: string;
  hint: string;
  onClick: () => void;
}

/** Blush tappable pill showing the block's start–end; opens inline time entry, 5-min snap. */
export function TimeRow({ label, hint, onClick }: TimeRowProps) {
  return (
    <button type="button" className="ss-sheet-timerow" onClick={onClick}>
      <span className="ss-sheet-timerow-t">{label}</span>
      <span className="ss-sheet-timerow-hint">
        {hint}
        <ChevronRightIcon />
      </span>
    </button>
  );
}
