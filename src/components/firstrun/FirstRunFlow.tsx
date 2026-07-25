import { useEffect, useState } from 'react';
import type { AnchorDraft } from '../../db/planGenerator';
import { applyAnchorsToTemplates } from '../../db/planGenerator';
import { getAllDayTemplates, getDayTemplate, saveDayTemplate, updateSettings } from '../../db/repository';
import { cloneTemplateBlocks, firstEmptyWeekday, withDefaultsIfNeeded } from '../../lib/firstRun';
import type { AppSettings, DayShape, DayTemplate, FirstRunStepId, TemplateBlock, Weekday } from '../../types';
import { AnchorsScreen } from './AnchorsScreen';
import { BuildDayScreen } from './BuildDayScreen';
import { DayShapeScreen } from './DayShapeScreen';
import { OfferNextDayScreen } from './OfferNextDayScreen';
import { RepeatDayScreen } from './RepeatDayScreen';
import { WeekendsBackupDoneScreen } from './WeekendsBackupDoneScreen';
import { WelcomeScreen } from './WelcomeScreen';

interface FirstRunFlowProps {
  settings: AppSettings;
  onComplete: () => void;
}

interface Step {
  id: FirstRunStepId;
  weekday?: Weekday;
}

/** S0 — the one-time, resumable setup sequence: welcome → day shape → anchors → the build-and-echo loop → done. */
export function FirstRunFlow({ settings, onComplete }: FirstRunFlowProps) {
  const [step, setStep] = useState<Step>({ id: settings.firstRunStep ?? 'welcome', weekday: settings.firstRunWeekday });
  const [dayShape, setDayShape] = useState<DayShape>(settings.dayShape);
  const [skippedWeekdays, setSkippedWeekdays] = useState<Weekday[]>(settings.firstRunSkippedWeekdays ?? []);
  const [templates, setTemplates] = useState<DayTemplate[] | null>(null);

  useEffect(() => {
    getAllDayTemplates().then(setTemplates);
  }, []);

  async function advance(next: Step, skipped = skippedWeekdays) {
    setStep(next);
    await updateSettings({ firstRunStep: next.id, firstRunWeekday: next.weekday, firstRunSkippedWeekdays: skipped });
  }

  async function continueLoop(skipped: Weekday[]) {
    const freshTemplates = await getAllDayTemplates();
    setTemplates(freshTemplates);
    const next = firstEmptyWeekday(freshTemplates, skipped);
    if (next) {
      await advance({ id: 'offerNextDay', weekday: next }, skipped);
    } else {
      await advance({ id: 'weekendsBackupDone' }, skipped);
    }
  }

  if (!templates) {
    return <div className="ss-screen" />;
  }

  if (step.id === 'welcome') {
    return <WelcomeScreen onBegin={() => advance({ id: 'dayShape' })} />;
  }

  if (step.id === 'dayShape') {
    return (
      <DayShapeScreen
        dayShape={dayShape}
        onContinue={async (shape) => {
          setDayShape(shape);
          await updateSettings({ dayShape: shape });
          await advance({ id: 'anchors' });
        }}
      />
    );
  }

  if (step.id === 'anchors') {
    return (
      <AnchorsScreen
        onContinue={async (anchors: AnchorDraft[]) => {
          if (anchors.length > 0) {
            await applyAnchorsToTemplates(anchors);
            setTemplates(await getAllDayTemplates());
          }
          await advance({ id: 'buildDay', weekday: 'monday' });
        }}
      />
    );
  }

  if (step.id === 'buildDay' && step.weekday) {
    const weekday = step.weekday;
    const existing = templates.find((t) => t.weekday === weekday);
    const effectiveDayShape = { ...dayShape, ...existing?.dayShapeOverride };
    const initialBlocks = withDefaultsIfNeeded(existing?.blocks ?? [], effectiveDayShape);

    return (
      <BuildDayScreen
        weekday={weekday}
        dayShape={effectiveDayShape}
        initialBlocks={initialBlocks}
        onDone={async (blocks: TemplateBlock[], dayShapeOverride?: Partial<DayShape>) => {
          await saveDayTemplate({
            weekday,
            blocks,
            dayShapeOverride: dayShapeOverride ? { ...existing?.dayShapeOverride, ...dayShapeOverride } : existing?.dayShapeOverride,
          });
          setTemplates(await getAllDayTemplates());
          await advance({ id: 'repeatDay', weekday });
        }}
      />
    );
  }

  if (step.id === 'repeatDay' && step.weekday) {
    const weekday = step.weekday;
    return (
      <RepeatDayScreen
        sourceWeekday={weekday}
        templates={templates}
        onCopy={async (selectedDays) => {
          const source = await getDayTemplate(weekday);
          const sourceNonAnchored = (source?.blocks ?? []).filter((block) => block.tier !== 'anchored');
          await Promise.all(
            selectedDays.map(async (day) => {
              // Anchored meetings stay on their own days either way — only the flexible/protected shape copies over.
              const existing = await getDayTemplate(day);
              const dayAnchors = (existing?.blocks ?? []).filter((block) => block.tier === 'anchored');
              await saveDayTemplate({ weekday: day, blocks: [...dayAnchors, ...cloneTemplateBlocks(sourceNonAnchored)] });
            }),
          );
          await continueLoop(skippedWeekdays);
        }}
        onSkip={() => continueLoop(skippedWeekdays)}
      />
    );
  }

  if (step.id === 'offerNextDay' && step.weekday) {
    const weekday = step.weekday;
    return (
      <OfferNextDayScreen
        weekday={weekday}
        onBuild={() => advance({ id: 'buildDay', weekday })}
        onLeaveBlank={() => {
          const nextSkipped = [...skippedWeekdays, weekday];
          setSkippedWeekdays(nextSkipped);
          continueLoop(nextSkipped);
        }}
      />
    );
  }

  return (
    <WeekendsBackupDoneScreen
      onFinish={async () => {
        await updateSettings({
          hasCompletedFirstRun: true,
          firstRunStep: undefined,
          firstRunWeekday: undefined,
          firstRunSkippedWeekdays: undefined,
        });
        onComplete();
      }}
    />
  );
}
