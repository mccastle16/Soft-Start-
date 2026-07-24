import { minuteToOffset } from './timelineMath';

interface NowMarkerProps {
  minute: number;
  dayStartMinute: number;
  scale: number;
}

/** A soft marker, not a red line — present, never alarming, never paired with lateness language. */
export function NowMarker({ minute, dayStartMinute, scale }: NowMarkerProps) {
  const top = minuteToOffset(minute, dayStartMinute, scale);
  return (
    <div className="ss-now" style={{ top }}>
      <div className="ss-now-line" />
      <div className="ss-now-dot" />
    </div>
  );
}
