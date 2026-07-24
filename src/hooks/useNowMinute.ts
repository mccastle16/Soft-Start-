import { useEffect, useState } from 'react';
import { getNowMinuteForDate } from '../lib/dayBoundary';

const REFRESH_INTERVAL_MS = 60_000;

/** The current minute-of-day for `logicalDate`, refreshed once a minute. */
export function useNowMinute(logicalDate: string | undefined): number | undefined {
  const [nowMinute, setNowMinute] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!logicalDate) return;

    const tick = () => setNowMinute(getNowMinuteForDate(logicalDate, new Date()));
    tick();
    const id = setInterval(tick, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [logicalDate]);

  return nowMinute;
}
