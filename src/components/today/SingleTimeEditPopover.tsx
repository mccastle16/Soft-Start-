import { useState } from 'react';
import { fromInputValue, SNAP_MINUTES, snapMinutes, toInputValue } from './blockEdits';

interface SingleTimeEditPopoverProps {
  minute: number;
  onCancel: () => void;
  onConfirm: (minute: number) => void;
}

/** The one-value sibling of TimeEditPopover — for S0.2/S3.2's single-time day-shape rows. */
export function SingleTimeEditPopover({ minute, onCancel, onConfirm }: SingleTimeEditPopoverProps) {
  const [value, setValue] = useState(toInputValue(minute));

  function handleConfirm() {
    onConfirm(snapMinutes(fromInputValue(value, minute)));
  }

  return (
    <div className="ss-time-edit ss-time-edit--inline">
      <div className="ss-time-edit-row">
        <input
          type="time"
          step={SNAP_MINUTES * 60}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="ss-time-edit-input"
          aria-label="Time"
        />
      </div>
      <div className="ss-time-edit-btns">
        <button type="button" className="ss-note-btn" onClick={handleConfirm}>
          Save
        </button>
        <button type="button" className="ss-note-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
