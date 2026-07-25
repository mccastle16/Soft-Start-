import '../today/Today.css';
import '../arrival/Arrival.css';
import './FirstRun.css';
import { IllustrationField } from '../arrival/IllustrationField';
import { PrimaryButton } from '../arrival/PrimaryButton';
import { AppWordmark } from '../today/AppWordmark';

interface WelcomeScreenProps {
  onBegin: () => void;
}

/** S0.1 — one screen, one promise, one pill. No tour. */
export function WelcomeScreen({ onBegin }: WelcomeScreenProps) {
  return (
    <div className="ss-screen">
      <IllustrationField variant="corner-glow" />
      <div className="ss-arrival-spacer" />
      <AppWordmark size="large" />
      <div className="ss-fr-promise">Your day, already planned. Gently.</div>
      <div className="ss-arrival-spacer" />
      <PrimaryButton onClick={onBegin}>Set up my week</PrimaryButton>
    </div>
  );
}
