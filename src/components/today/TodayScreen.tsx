import { useState } from 'react';
import './Today.css';
import '../sheets/Sheets.css';
import '../closing/Closing.css';
import { GREETING_QUOTES } from '../../content/greetingQuotes';
import { addBlockToTemplate, moveBlockToTomorrow } from '../../db/planGenerator';
import { useNowMinute } from '../../hooks/useNowMinute';
import type { TodayPlanPatch } from '../../hooks/useTodayPlan';
import { WEEKDAY_LABELS } from '../../lib/weekdayLabels';
import type { DailyPlan, DayBlock } from '../../types';
import { AddSheet } from '../sheets/AddSheet';
import { BlockSheet } from '../sheets/BlockSheet';
import { EveningView } from '../closing/EveningView';
import { AppWordmark } from './AppWordmark';
import { activeBlocks } from './blockEdits';
import { IconButton } from './IconButton';
import { IntentionLine } from './IntentionLine';
import { OpenDayState } from './OpenDayState';
import { ChevronLeftIcon, PlusIcon } from './icons';
import { ProgressRing } from './ProgressRing';
import { QuoteLine } from './QuoteLine';
import { ScreenHeader } from './ScreenHeader';
import { TabBar, type TabKey } from './TabBar';
import { TimelineView } from './TimelineView';

function formatDateLabel(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

interface TodayScreenProps {
  plan: DailyPlan;
  updatePlan: (patch: TodayPlanPatch) => void;
  onNavigate: (tab: TabKey) => void;
  /** Which tab reads as active in the bar — 'week' when this is a day drilled into from Week. Defaults to 'today'. */
  activeTab?: TabKey;
  /** Present only when this screen was opened from elsewhere (e.g. Week) — renders a way back that doesn't change tabs. */
  onBack?: () => void;
}

type OpenSheet = { kind: 'block'; blockId: string } | { kind: 'add' } | null;

export function TodayScreen({ plan, updatePlan, onNavigate, activeTab = 'today', onBack }: TodayScreenProps) {
  const nowMinute = useNowMinute(plan.date);
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);

  const visibleBlocks = activeBlocks(plan.blocks);
  const doneCount = visibleBlocks.filter((block) => block.status === 'done').length;
  const weekdayLabel = WEEKDAY_LABELS[plan.weekday];

  function handleAddToRhythm(block: DayBlock) {
    void addBlockToTemplate(plan.weekday, block);
  }

  function handleMoveToTomorrow(block: DayBlock) {
    void moveBlockToTomorrow(plan.date, block);
    updatePlan({ blocks: plan.blocks.map((b) => (b.id === block.id ? { ...b, status: 'moved' } : b)) });
  }

  function handleRestToday(blockId: string) {
    updatePlan({ blocks: plan.blocks.map((b) => (b.id === blockId ? { ...b, status: 'resting' } : b)) });
  }

  function handleAddBlock(block: DayBlock, newDayStartMinute?: number, newDayEndMinute?: number) {
    updatePlan({
      blocks: [...plan.blocks, block],
      dayStartMinute: newDayStartMinute ?? plan.dayStartMinute,
      dayEndMinute: newDayEndMinute ?? plan.dayEndMinute,
    });
  }

  const sheetBlock =
    openSheet?.kind === 'block' ? visibleBlocks.find((block) => block.id === openSheet.blockId) : undefined;

  // Evening/after (Flow 6a): once the day's actual end has passed, Today closes quietly — only what
  // was done, always a warm line. Checked before the open-day state so a day that's simply over never
  // reads as an invitation to add more to it.
  const isEveningState = nowMinute !== undefined && nowMinute >= plan.dayEndMinute;

  if (isEveningState) {
    const doneBlocks = visibleBlocks.filter((block) => block.status === 'done');
    const isComplete = visibleBlocks.length > 0 && doneBlocks.length === visibleBlocks.length;

    return (
      <div className="ss-screen ss-screen--tabbed">
        <AppWordmark />
        {onBack && (
          <button type="button" className="ss-back-row" onClick={onBack}>
            <ChevronLeftIcon />
            <span>Week</span>
          </button>
        )}
        <QuoteLine quote={GREETING_QUOTES[plan.greetingQuoteId]} />
        <IntentionLine intention={plan.intention} />
        <EveningView
          weekdayLabel={weekdayLabel}
          doneBlocks={doneBlocks}
          isComplete={isComplete}
          celebrationShown={plan.celebrationShown ?? false}
          onCelebrationShown={() => updatePlan({ celebrationShown: true })}
        />
        <TabBar active={activeTab} onSelect={onNavigate} />
      </div>
    );
  }

  return (
    <div className="ss-screen ss-screen--tabbed">
      <AppWordmark />
      {onBack && (
        <button type="button" className="ss-back-row" onClick={onBack}>
          <ChevronLeftIcon />
          <span>Week</span>
        </button>
      )}
      <QuoteLine quote={GREETING_QUOTES[plan.greetingQuoteId]} />
      <IntentionLine intention={plan.intention} />

      <ScreenHeader
        title={weekdayLabel}
        subtitle={formatDateLabel(plan.date)}
        actions={
          <>
            <IconButton label="Add something" icon={<PlusIcon />} onClick={() => setOpenSheet({ kind: 'add' })} />
            <ProgressRing done={doneCount} total={visibleBlocks.length} />
          </>
        }
      />

      {visibleBlocks.length === 0 ? (
        <OpenDayState weekdayLabel={weekdayLabel} onAdd={() => setOpenSheet({ kind: 'add' })} />
      ) : (
        <div className="ss-tlwrap">
          <TimelineView
            dayStartMinute={plan.dayStartMinute}
            dayEndMinute={plan.dayEndMinute}
            blocks={visibleBlocks}
            nowMinute={nowMinute}
            onUpdatePlan={updatePlan}
            onOpenBlockSheet={(blockId) => setOpenSheet({ kind: 'block', blockId })}
          />
        </div>
      )}

      <TabBar active={activeTab} onSelect={onNavigate} />

      {sheetBlock && (
        <BlockSheet
          block={sheetBlock}
          blocks={plan.blocks}
          dayStartMinute={plan.dayStartMinute}
          dayEndMinute={plan.dayEndMinute}
          onClose={() => setOpenSheet(null)}
          onUpdatePlan={updatePlan}
          onMoveToTomorrow={handleMoveToTomorrow}
          onRestToday={handleRestToday}
          onAddToRhythm={handleAddToRhythm}
        />
      )}
      {openSheet?.kind === 'add' && (
        <AddSheet
          blocks={visibleBlocks}
          dayStartMinute={plan.dayStartMinute}
          dayEndMinute={plan.dayEndMinute}
          onClose={() => setOpenSheet(null)}
          onAdd={handleAddBlock}
          onAddToRhythm={handleAddToRhythm}
        />
      )}
    </div>
  );
}
