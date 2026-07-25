import { PlusIcon } from './icons';

interface AddPillProps {
  onClick: () => void;
  label?: string;
}

/** The weekend's (and any empty day's) begin-moment: a small rose "+ Add something" pill. */
export function AddPill({ onClick, label = 'Add something' }: AddPillProps) {
  return (
    <button type="button" className="ss-add-pill" onClick={onClick}>
      <PlusIcon />
      {label}
    </button>
  );
}
