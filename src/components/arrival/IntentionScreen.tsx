import { useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { AppWordmark } from '../today/AppWordmark';
import { GhostButton } from './GhostButton';
import { IllustrationField } from './IllustrationField';
import { PrimaryButton } from './PrimaryButton';
import { TextField } from './TextField';

interface IntentionScreenProps {
  quoteText: string;
  question: string;
  onSubmit: (answer: string) => void;
  onSkip: () => void;
}

/** Matches --t-med in tokens.css. */
const EXIT_DURATION_MS = 260;

type ExitState = 'none' | 'submit' | 'skip';

/** R2 — full-screen, directly after R1, quote already docked at top. */
export function IntentionScreen({ quoteText, question, onSubmit, onSkip }: IntentionScreenProps) {
  const [answer, setAnswer] = useState('');
  const [exiting, setExiting] = useState<ExitState>('none');
  const reducedMotion = usePrefersReducedMotion();

  const finish = (state: ExitState, run: () => void) => {
    if (exiting !== 'none') return;
    setExiting(state);
    setTimeout(run, reducedMotion ? 1 : EXIT_DURATION_MS);
  };

  const handleSubmit = () => finish('submit', () => onSubmit(answer.trim()));
  const handleSkip = () => finish('skip', onSkip);

  return (
    <div className="ss-arrival-screen ss-arrival-porcelain">
      <IllustrationField variant="footer-pool" />

      <div className="ss-arrival-dock">
        <AppWordmark size="small" />
        <div className="ss-arrival-quote ss-arrival-quote--docked">{quoteText}</div>
      </div>

      <div className="ss-arrival-spacer" />

      <div
        className={`ss-arrival-question-block ${exiting === 'submit' ? 'ss-arrival-float-up' : 'ss-arrival-fadein'}`}
      >
        {exiting === 'submit' && answer ? (
          <div className="ss-arrival-answer-preview">“{answer}”</div>
        ) : (
          <>
            <div className="ss-arrival-question">{question}</div>
            <TextField
              className="ss-arrival-input"
              placeholder="one line is plenty…"
              value={answer}
              autoFocus
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </>
        )}
      </div>

      <div className="ss-arrival-spacer" />

      <div className={exiting === 'skip' ? 'ss-arrival-fadeout' : ''}>
        <PrimaryButton onClick={handleSubmit}>Set my intention</PrimaryButton>
        <GhostButton onClick={handleSkip}>Maybe later</GhostButton>
      </div>
    </div>
  );
}
