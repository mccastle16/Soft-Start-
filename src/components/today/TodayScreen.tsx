import './Today.css';
import { GREETING_QUOTES } from '../../content/greetingQuotes';
import { useNowMinute } from '../../hooks/useNowMinute';
import { useTodayPlan } from '../../hooks/useTodayPlan';
import type { Weekday } from '../../types';
import { AppWordmark } from './AppWordmark';
import { IconButton } from './IconButton';
import { IntentionLine } from './IntentionLine';
import { OpenDayState } from './OpenDayState';
import { PlusIcon } from './icons';
import { ProgressRing } from './ProgressRing';
import { QuoteLine } from './QuoteLine';
import { ScreenHeader } from './ScreenHeader';
import { TabBar } from './TabBar';
import { TimelineView } from './TimelineView';

const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

function formatDateLabel(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export function TodayScreen() {
  const plan = useTodayPlan();
  const nowMinute = useNowMinute(plan?.date);

  if (!plan) {
    return <div className="ss-screen" />;
  }

  const doneCount = plan.blocks.filter((block) => block.status === 'done').length;
  const weekdayLabel = WEEKDAY_LABELS[plan.weekday];

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
            <IconButton label="Add something" icon={<PlusIcon />} />
            <ProgressRing done={doneCount} total={plan.blocks.length} />
          </>
        }
      />

      {plan.blocks.length === 0 ? (
        <OpenDayState weekdayLabel={weekdayLabel} />
      ) : (
        <div className="ss-tlwrap">
          <TimelineView
            dayStartMinute={plan.dayStartMinute}
            dayEndMinute={plan.dayEndMinute}
            blocks={plan.blocks}
            nowMinute={nowMinute}
          />
        </div>
      )}

      <TabBar active="today" />
    </div>
  );
}
