import { useState } from 'react';
import '../today/Today.css';
import '../sheets/Sheets.css';
import '../closing/Closing.css';
import './Week.css';
import { addBlockToTemplate, addOneOffBlockToDate } from '../../db/planGenerator';
import { formatWeekRangeLabel, getLogicalDateString } from '../../lib/dayBoundary';
import { useDailyPlan } from '../../hooks/useTodayPlan';
import type { DayBlock } from '../../types';
import { AddSheet } from '../sheets/AddSheet';
import { AppWordmark } from '../today/AppWordmark';
import { activeBlocks } from '../today/blockEdits';
import { TabBar, type TabKey } from '../today/TabBar';
import { TodayScreen } from '../today/TodayScreen';
import { DayCard, type DayTemperature } from './DayCard';
import { DayPeekSheet } from './DayPeekSheet';
import type { WeekDay } from '../../hooks/useWeekPlans';
import { useWeekPlans } from '../../hooks/useWeekPlans';

interface WeekScreenProps {
  onNavigate: (tab: TabKey) => void;
}

function temperatureFor(date: string, todayDate: string): DayTemperature {
  if (date < todayDate) return 'past';
  if (date === todayDate) return 'today';
  return 'future';
}

/** A today/future day opened from Week (SH5's full-featured sibling): same screen as S1, just reached from S2 and returning to it. */
function WeekDayDetail({ date, onBack, onNavigate }: { date: string; onBack: () => void; onNavigate: (tab: TabKey) => void }) {
  const [plan, updatePlan] = useDailyPlan(date);

  if (!plan) {
    return <div className="ss-screen" />;
  }

  return <TodayScreen plan={plan} updatePlan={updatePlan} onNavigate={onNavigate} activeTab="week" onBack={onBack} />;
}

/** S2 — orientation and light additions; never a report card. */
export function WeekScreen({ onNavigate }: WeekScreenProps) {
  const { days, refresh } = useWeekPlans();
  const [addTarget, setAddTarget] = useState<WeekDay | null>(null);
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [peekTarget, setPeekTarget] = useState<WeekDay | null>(null);

  if (!days) {
    return <div className="ss-screen" />;
  }

  const todayDate = getLogicalDateString(new Date());

  function handleAdd(block: DayBlock, newDayStartMinute?: number, newDayEndMinute?: number) {
    if (!addTarget) return;
    void addOneOffBlockToDate(addTarget.date, block, newDayStartMinute, newDayEndMinute).then(refresh);
    setAddTarget(null);
  }

  function handleAddToRhythm(block: DayBlock) {
    if (!addTarget) return;
    void addBlockToTemplate(addTarget.weekday, block);
  }

  function handleOpen(day: WeekDay, temperature: DayTemperature) {
    if (temperature === 'past') {
      setPeekTarget(day);
    } else {
      setOpenDate(day.date);
    }
  }

  function handleDetailNavigate(tab: TabKey) {
    if (tab === 'week') {
      setOpenDate(null);
      refresh();
      return;
    }
    onNavigate(tab);
  }

  if (openDate) {
    return (
      <WeekDayDetail
        date={openDate}
        onBack={() => {
          setOpenDate(null);
          refresh();
        }}
        onNavigate={handleDetailNavigate}
      />
    );
  }

  return (
    <div className="ss-screen ss-screen--tabbed">
      <AppWordmark />
      <div className="ss-week-hdr">
        <h2>This week</h2>
        <div className="ss-week-hdr-sub">{formatWeekRangeLabel(days[0].date, days[6].date)}</div>
      </div>

      <div className="ss-week-list">
        {days.map((day) => {
          const temperature = temperatureFor(day.date, todayDate);
          return (
            <DayCard
              key={day.date}
              date={day.date}
              weekday={day.weekday}
              blocks={day.blocks}
              temperature={temperature}
              onAdd={() => setAddTarget(day)}
              onOpen={() => handleOpen(day, temperature)}
            />
          );
        })}
      </div>

      <TabBar active="week" onSelect={onNavigate} />

      {addTarget && (
        <AddSheet
          blocks={activeBlocks(addTarget.blocks)}
          dayStartMinute={addTarget.dayStartMinute}
          dayEndMinute={addTarget.dayEndMinute}
          onClose={() => setAddTarget(null)}
          onAdd={handleAdd}
          onAddToRhythm={handleAddToRhythm}
        />
      )}

      {peekTarget && (
        <DayPeekSheet
          date={peekTarget.date}
          weekday={peekTarget.weekday}
          blocks={peekTarget.blocks}
          onClose={() => setPeekTarget(null)}
        />
      )}
    </div>
  );
}
