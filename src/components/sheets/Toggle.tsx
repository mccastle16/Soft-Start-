interface ToggleProps {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}

/** Rose when on, deep-blush when off. Permanence (the weekly-rhythm toggle) is a deliberate flick, never an accident. */
export function Toggle({ on, onChange, label }: ToggleProps) {
  return (
    <div className="ss-sheet-togglerow">
      <span className="ss-sheet-togglerow-lbl">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={`ss-toggle ${on ? 'ss-toggle--on' : ''}`.trim()}
        onClick={() => onChange(!on)}
      />
    </div>
  );
}
