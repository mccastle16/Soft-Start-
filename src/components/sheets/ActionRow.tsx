interface SecondaryAction {
  label: string;
  onClick: () => void;
}

interface ActionRowProps {
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  /** The Move/Rest equal-blush pair — omitted for the Add sheet's single-primary mode. */
  secondary?: [SecondaryAction, SecondaryAction];
  ghostLabel?: string;
  onGhost?: () => void;
}

/** The product philosophy in button form: one rose primary, equal blush twins, one ghost. */
export function ActionRow({ primaryLabel, onPrimary, primaryDisabled, secondary, ghostLabel, onGhost }: ActionRowProps) {
  return (
    <>
      <button type="button" className="ss-sheet-btn ss-sheet-btn--done" onClick={onPrimary} disabled={primaryDisabled}>
        {primaryLabel}
      </button>
      {secondary && (
        <div className="ss-sheet-pair">
          <button type="button" className="ss-sheet-btn ss-sheet-btn--sec" onClick={secondary[0].onClick}>
            {secondary[0].label}
          </button>
          <button type="button" className="ss-sheet-btn ss-sheet-btn--sec" onClick={secondary[1].onClick}>
            {secondary[1].label}
          </button>
        </div>
      )}
      {ghostLabel && onGhost && (
        <button type="button" className="ss-sheet-btn ss-sheet-btn--ghost" onClick={onGhost}>
          {ghostLabel}
        </button>
      )}
    </>
  );
}
