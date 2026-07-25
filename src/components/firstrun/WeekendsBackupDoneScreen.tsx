import { useState } from 'react';
import './FirstRun.css';
import '../today/Today.css';
import '../arrival/Arrival.css';
import { GhostButton } from '../arrival/GhostButton';
import { PrimaryButton } from '../arrival/PrimaryButton';
import { downloadBackup } from '../../db/backup';
import { Stepper } from './Stepper';

interface WeekendsBackupDoneScreenProps {
  onFinish: () => void;
}

type Beat = 'weekends' | 'backup' | 'done';

/** S0.6 — one screen, three beats: weekends stay blank, a soft backup offer, and the send-off. */
export function WeekendsBackupDoneScreen({ onFinish }: WeekendsBackupDoneScreenProps) {
  const [beat, setBeat] = useState<Beat>('weekends');

  if (beat === 'weekends') {
    return (
      <div className="ss-screen">
        <Stepper activeCount={6} />
        <div className="ss-fr-beat">
          <div className="ss-fr-h2">Weekends start blank.</div>
          <div className="ss-fr-sub">Add things only when you want to.</div>
        </div>
        <PrimaryButton onClick={() => setBeat('backup')}>Perfect</PrimaryButton>
      </div>
    );
  }

  if (beat === 'backup') {
    return (
      <div className="ss-screen">
        <Stepper activeCount={6} />
        <div className="ss-fr-beat">
          <div className="ss-fr-h2">Your rhythm lives on this device.</div>
          <div className="ss-fr-sub">Want a backup file, just in case?</div>
        </div>
        <PrimaryButton
          onClick={async () => {
            await downloadBackup();
            setBeat('done');
          }}
        >
          Export now
        </PrimaryButton>
        <GhostButton onClick={() => setBeat('done')}>Maybe later</GhostButton>
      </div>
    );
  }

  return (
    <div className="ss-screen">
      <Stepper activeCount={6} />
      <div className="ss-fr-beat">
        <div className="ss-fr-h2">Your week is ready.</div>
        <div className="ss-fr-sub">See you in the morning 🌿</div>
      </div>
      <PrimaryButton onClick={onFinish}>Done</PrimaryButton>
    </div>
  );
}
