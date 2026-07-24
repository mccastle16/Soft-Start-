import { formatHourLabel, getHourTicks, minuteToOffset } from './timelineMath';

interface TimeGutterProps {
  dayStartMinute: number;
  dayEndMinute: number;
  scale: number;
}

export function TimeGutter({ dayStartMinute, dayEndMinute, scale }: TimeGutterProps) {
  const ticks = getHourTicks(dayStartMinute, dayEndMinute);

  return (
    <div className="ss-gutter">
      {ticks.map((minute, index) => (
        <span key={minute} style={{ top: minuteToOffset(minute, dayStartMinute, scale) }}>
          {formatHourLabel(minute, index === 0)}
        </span>
      ))}
    </div>
  );
}
