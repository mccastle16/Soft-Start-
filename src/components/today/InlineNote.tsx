import type { ReactNode } from 'react';

interface InlineNoteProps {
  /** Omit when hosting inline (e.g. inside a sheet) instead of absolute-positioned over the timeline. */
  top?: number;
  message: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel: string;
  onSecondary: () => void;
}

/** N1 (overlap) and N2 (boundary) — the app's only question voice, deep blush, never red, never blocking. */
export function InlineNote({ top, message, primaryLabel, onPrimary, secondaryLabel, onSecondary }: InlineNoteProps) {
  return (
    <div className={`ss-note ${top === undefined ? 'ss-note--inline' : ''}`.trim()} style={{ top }} role="status">
      <div className="ss-note-txt">
        <span className="ss-note-dot" />
        <span>{message}</span>
      </div>
      <div className="ss-note-btns">
        <button type="button" className="ss-note-btn" onClick={onPrimary}>
          {primaryLabel}
        </button>
        <button type="button" className="ss-note-btn-ghost" onClick={onSecondary}>
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}
