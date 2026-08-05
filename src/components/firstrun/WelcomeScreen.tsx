import { useState } from 'react';
import '../today/Today.css';
import '../arrival/Arrival.css';
import './FirstRun.css';
import sampleBackupJson from '../../dev/sampleBackup.json?raw';
import { importBackupJson } from '../../db/backup';
import { GhostButton } from '../arrival/GhostButton';
import { IllustrationField } from '../arrival/IllustrationField';
import { PrimaryButton } from '../arrival/PrimaryButton';
import { AppWordmark } from '../today/AppWordmark';

interface WelcomeScreenProps {
  onBegin: () => void;
}

/** S0.1 — one screen, one promise, one pill. No tour. */
export function WelcomeScreen({ onBegin }: WelcomeScreenProps) {
  const [loadingSample, setLoadingSample] = useState(false);

  // Dev-only shortcut: loads src/dev/sampleBackup.json in place of a fresh first run and reloads
  // straight into it, so design work doesn't require re-doing setup every time storage is cleared.
  // Gated on import.meta.env.DEV, so it's absent from any production build — delete this block,
  // the sampleBackup.json import above, and src/dev/ once the app is ready to publish.
  async function handleLoadSample() {
    setLoadingSample(true);
    await importBackupJson(sampleBackupJson);
    window.location.reload();
  }

  return (
    <div className="ss-screen">
      <IllustrationField variant="corner-glow" />
      <div className="ss-arrival-spacer" />
      <AppWordmark size="large" />
      <div className="ss-fr-promise">Your day, already planned. Gently.</div>
      <div className="ss-arrival-spacer" />
      <PrimaryButton onClick={onBegin}>Set up my week</PrimaryButton>
      {import.meta.env.DEV && (
        <GhostButton onClick={handleLoadSample} disabled={loadingSample}>
          Already been here (dev)
        </GhostButton>
      )}
    </div>
  );
}
