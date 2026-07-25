import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { IllustrationField } from './IllustrationField';
import { SkipHint } from './SkipHint';

interface GreetingScreenProps {
  greetingWord: string;
  quoteText: string;
  onDone: () => void;
}

/** Matches --t-slow in tokens.css; collapsed to near-zero under reduced motion so the cut still lands cleanly. */
const EXIT_DURATION_MS = 420;
const AUTO_ADVANCE_MS = 5200;
const REDUCED_MOTION_ADVANCE_MS = 700;

/** R1 — the rose-field greeting. Doubles as the plan-loading moment; tap anywhere skips ahead. */
export function GreetingScreen({ greetingWord, quoteText, onDone }: GreetingScreenProps) {
  const [exiting, setExiting] = useState(false);
  const advancing = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const advance = () => {
    if (advancing.current) return;
    advancing.current = true;
    setExiting(true);
    setTimeout(onDone, reducedMotion ? 1 : EXIT_DURATION_MS);
  };

  useEffect(() => {
    const id = setTimeout(advance, reducedMotion ? REDUCED_MOTION_ADVANCE_MS : AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <div
      className={`ss-arrival-screen ss-arrival-rosefield ${exiting ? 'ss-arrival-exit' : ''}`.trim()}
      onClick={advance}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && advance()}
    >
      <IllustrationField variant="full-rose" />
      <div className="ss-arrival-spacer" />
      <div className={`ss-arrival-greeting ${exiting ? 'ss-arrival-greeting-float' : 'ss-arrival-greeting-in'}`}>
        <div className="ss-arrival-greeting-word">{greetingWord}</div>
        <div className="ss-arrival-quote ss-arrival-quote--onfield">{quoteText}</div>
      </div>
      <div className="ss-arrival-spacer" />
      <SkipHint onField />
    </div>
  );
}
