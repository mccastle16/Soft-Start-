import { useState } from 'react';
import './Today.css';
import '../sheets/Sheets.css';
import { GREETING_QUOTES } from '../../content/greetingQuotes';
import { addBlockToTemplate, moveBlockToTomorrow } from '../../db/planGenerator';
import { useNowMinute } from '../../hooks/useNowMinute';
import type { TodayPlanPatch } from '../../hooks/useTodayPlan';
import { WEEKDAY_LABELS } from '../../lib/weekdayLabels';
import type { DailyPlan, DayBlock } from '../../types';
import { AddSheet } from '../sheets/AddSheet';
import { BlockSheet } from '../sheets/BlockSheet';
import { AppWordmark } from './AppWordmark';
import { activeBlocks } from './blockEdits';
import { IconButton } from './IconButton';
import { IntentionLine } from './IntentionLine';
import { OpenDayState } from './OpenDayState';
import { PlusIcon } from './icons';
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
}

type OpenSheet = { kind: 'block'; blockId: string } | { kind: 'add' } | null;

export function TodayScreen({ plan, updatePlan, onNavigate }: TodayScreenProps) {
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

  return (
    <div className="ss-screen">
      <AppWordmark />
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

      <TabBar active="today" onSelect={onNavigate} />

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
