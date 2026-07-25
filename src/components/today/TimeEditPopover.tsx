import { useState } from 'react';
import { fromInputValue, SNAP_MINUTES, snapMinutes, toInputValue } from './blockEdits';

interface TimeEditPopoverProps {
  /** Omit when hosting inline (e.g. inside a sheet) instead of absolute-positioned over the timeline. */
  top?: number;
  startMinute: number;
  endMinute: number;
  onCancel: () => void;
  onConfirm: (startMinute: number, endMinute: number) => void;
}

/** Tap-a-block's-times precision entry (§6.3): typed/picked exact times, 5-minute snap, feeds the same overlap/boundary rules as an edge-drag. */
export function TimeEditPopover({ top, startMinute, endMinute, onCancel, onConfirm }: TimeEditPopoverProps) {
  const [start, setStart] = useState(toInputValue(startMinute));
  const [end, setEnd] = useState(toInputValue(endMinute));
  const [error, setError] = useState(false);

  function handleConfirm() {
    const newStart = snapMinutes(fromInputValue(start, startMinute));
    const newEnd = snapMinutes(fromInputValue(end, endMinute));
    if (newEnd <= newStart) {
      setError(true);
      return;
    }
    onConfirm(newStart, newEnd);
  }

  return (
    <div className={`ss-time-edit ${top === undefined ? 'ss-time-edit--inline' : ''}`.trim()} style={{ top }}>
      <div className="ss-time-edit-row">
        <input
          type="time"
          step={SNAP_MINUTES * 60}
          value={start}
          onChange={(event) => {
            setError(false);
            setStart(event.target.value);
          }}
          className="ss-time-edit-input"
          aria-label="Start time"
        />
        <span className="ss-time-edit-sep">–</span>
        <input
          type="time"
          step={SNAP_MINUTES * 60}
          value={end}
          onChange={(event) => {
            setError(false);
            setEnd(event.target.value);
          }}
          className="ss-time-edit-input"
          aria-label="End time"
        />
      </div>
      {error && <div className="ss-time-edit-error">End has to be after start.</div>}
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
