import { useId } from 'react';

interface ProgressRingProps {
  done: number;
  total: number;
}

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRing({ done, total }: ProgressRingProps) {
  const gradientId = useId().replace(/:/g, '');
  const fraction = total > 0 ? done / total : 0;
  const offset = CIRCUMFERENCE * (1 - fraction);

  return (
    <div className="ss-ring" role="img" aria-label={`${done} of ${total} done`}>
      <svg width="52" height="52">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-soft)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <circle className="ss-ring-track" cx="26" cy="26" r={RADIUS} />
        <circle
          className="ss-ring-fill"
          cx="26"
          cy="26"
          r={RADIUS}
          stroke={`url(#${gradientId})`}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ss-ring-value">
        {done}/{total}
      </div>
    </div>
  );
}
