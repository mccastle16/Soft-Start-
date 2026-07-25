import { useState } from 'react';
import '../today/Today.css';
import '../sheets/Sheets.css';
import './Week.css';
import { addBlockToTemplate, addOneOffBlockToDate } from '../../db/planGenerator';
import { formatWeekRangeLabel, getLogicalDateString } from '../../lib/dayBoundary';
import type { DayBlock } from '../../types';
import { AddSheet } from '../sheets/AddSheet';
import { AppWordmark } from '../today/AppWordmark';
import { activeBlocks } from '../today/blockEdits';
import { TabBar, type TabKey } from '../today/TabBar';
import { DayCard, type DayTemperature } from './DayCard';
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

/** S2 — orientation and light additions; never a report card. */
export function WeekScreen({ onNavigate }: WeekScreenProps) {
  const { days, refresh } = useWeekPlans();
  const [addTarget, setAddTarget] = useState<WeekDay | null>(null);

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

  return (
    <div className="ss-screen">
      <AppWordmark />
      <div className="ss-week-hdr">
        <h2>This week</h2>
        <div className="ss-week-hdr-sub">{formatWeekRangeLabel(days[0].date, days[6].date)}</div>
      </div>

      <div className="ss-week-list">
        {days.map((day) => (
          <DayCard
            key={day.date}
            date={day.date}
            weekday={day.weekday}
            blocks={day.blocks}
            temperature={temperatureFor(day.date, todayDate)}
            onAdd={() => setAddTarget(day)}
          />
        ))}
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
    </div>
  );
}
