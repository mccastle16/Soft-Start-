import './FirstRun.css';
import '../today/Today.css';
import '../arrival/Arrival.css';
import { GhostButton } from '../arrival/GhostButton';
import { PrimaryButton } from '../arrival/PrimaryButton';
import { WEEKDAY_LABELS } from '../../lib/weekdayLabels';
import type { Weekday } from '../../types';
import { Stepper } from './Stepper';

interface OfferNextDayScreenProps {
  weekday: Weekday;
  onBuild: () => void;
  onLeaveBlank: () => void;
}

/** S0.5b — the next consecutive uncovered weekday, offered gently; blank stays a fully valid answer. */
export function OfferNextDayScreen({ weekday, onBuild, onLeaveBlank }: OfferNextDayScreenProps) {
  const label = WEEKDAY_LABELS[weekday];

  return (
    <div className="ss-screen">
      <Stepper activeCount={5} />
      <div className="ss-arrival-spacer" />
      <div className="ss-fr-h2" style={{ textAlign: 'center' }}>
        Your {label}s are
        <br />
        currently blank
      </div>
      <div className="ss-fr-sub" style={{ textAlign: 'center' }}>
        Blank is a fine way for a day to be —<br />
        it'll simply open as "wide open."
      </div>
      <PrimaryButton style={{ maxWidth: 260, margin: '18px auto 0' }} onClick={onBuild}>
        Build {label} now
      </PrimaryButton>
      <GhostButton onClick={onLeaveBlank}>Leave blank for now</GhostButton>
      <div className="ss-arrival-spacer" />
      <div className="ss-fr-hint" style={{ textAlign: 'center' }}>
        You can build or change any day later in Rhythm.
      </div>
    </div>
  );
}
