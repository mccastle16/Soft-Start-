import { ChevronRightIcon } from '../today/icons';

type SettingsRowProps =
  | { variant: 'value'; label: string; value: string; onClick: () => void }
  | { variant: 'nav'; label: string; hint: string; onClick: () => void }
  | { variant: 'blank'; label: string };

/** White card row, label left. `value` opens a TimePicker; `nav` hints at a destination; `blank` is the recessed weekend row. */
export function SettingsRow(props: SettingsRowProps) {
  if (props.variant === 'blank') {
    return (
      <div className="ss-setrow ss-setrow--blank">
        <span className="ss-setrow-lbl">{props.label}</span>
      </div>
    );
  }

  if (props.variant === 'nav') {
    return (
      <button type="button" className="ss-setrow" onClick={props.onClick}>
        <span className="ss-setrow-lbl">{props.label}</span>
        <span className="ss-setrow-hint">
          {props.hint}
          <ChevronRightIcon />
        </span>
      </button>
    );
  }

  return (
    <button type="button" className="ss-setrow" onClick={props.onClick}>
      <span className="ss-setrow-lbl">{props.label}</span>
      <span className="ss-setrow-val">{props.value}</span>
    </button>
  );
}
