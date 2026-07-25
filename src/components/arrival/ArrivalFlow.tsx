import { useEffect, useState } from 'react';
import { GREETING_QUOTES } from '../../content/greetingQuotes';
import { INTENTION_PROMPTS, nextIntentionPromptId } from '../../content/intentionPrompts';
import { getSettings, updateSettings } from '../../db/repository';
import { getTimeAwareGreeting, isGapReturn } from '../../lib/greeting';
import type { DailyPlan, DayIntention } from '../../types';
import './Arrival.css';
import { GreetingScreen } from './GreetingScreen';
import { IntentionScreen } from './IntentionScreen';

interface ArrivalFlowProps {
  plan: DailyPlan;
  onComplete: (patch: { intention?: DayIntention; ritualCompletedAt: string }) => void;
}

type Step = 'loading' | 'greeting' | 'intention';

/** R1 → R2 — the one orchestrated moment per day, then a hand-off to Today. */
export function ArrivalFlow({ plan, onComplete }: ArrivalFlowProps) {
  const [step, setStep] = useState<Step>('loading');
  const [greetingWord, setGreetingWord] = useState('Good morning');
  const [greetingQuote, setGreetingQuote] = useState(GREETING_QUOTES[plan.greetingQuoteId]);
  const [promptId, setPromptId] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function prepare() {
      const settings = await getSettings();
      const gap = isGapReturn(settings.lastRitualDate, plan.date);
      const nextPromptId = nextIntentionPromptId(settings.lastIntentionPromptId);
      // Persisted as soon as it's chosen (not on submit) so the rotation still advances even if today's prompt is skipped.
      await updateSettings({ lastIntentionPromptId: nextPromptId });
      if (cancelled) return;

      setGreetingWord(gap ? 'Welcome back' : getTimeAwareGreeting(new Date()));
      setGreetingQuote(gap ? 'today counts.' : GREETING_QUOTES[plan.greetingQuoteId]);
      setPromptId(nextPromptId);
      setStep('greeting');
    }

    prepare();
    return () => {
      cancelled = true;
    };
  }, [plan.date, plan.greetingQuoteId]);

  const complete = (intention: DayIntention | undefined) => {
    void updateSettings({ lastRitualDate: plan.date });
    onComplete({ intention, ritualCompletedAt: new Date().toISOString() });
  };

  if (step === 'loading') {
    return <div className="ss-screen" />;
  }

  if (step === 'greeting') {
    return <GreetingScreen greetingWord={greetingWord} quoteText={greetingQuote} onDone={() => setStep('intention')} />;
  }

  return (
    <IntentionScreen
      quoteText={GREETING_QUOTES[plan.greetingQuoteId]}
      question={INTENTION_PROMPTS[promptId]}
      onSubmit={(answer) => complete(answer ? { promptId, answer } : undefined)}
      onSkip={() => complete(undefined)}
    />
  );
}
