import type { ReactNode } from 'react';
import { CalendarIcon, SunIcon, WavesIcon } from './icons';

export type TabKey = 'today' | 'week' | 'rhythm';

interface Tab {
  key: TabKey;
  label: string;
  icon: ReactNode;
}

const TABS: Tab[] = [
  { key: 'today', label: 'Today', icon: <SunIcon /> },
  { key: 'week', label: 'Week', icon: <CalendarIcon /> },
  { key: 'rhythm', label: 'Rhythm', icon: <WavesIcon /> },
];

interface TabBarProps {
  active: TabKey;
  onSelect?: (key: TabKey) => void;
}

export function TabBar({ active, onSelect }: TabBarProps) {
  return (
    <nav className="ss-tabs">
      {TABS.map((tab) => (
        <div
          key={tab.key}
          className={`ss-tab${tab.key === active ? ' ss-tab--on' : ''}`}
          onClick={() => onSelect?.(tab.key)}
          role="button"
          tabIndex={0}
        >
          <div className="ss-tab-icon">{tab.icon}</div>
          <span>{tab.label}</span>
        </div>
      ))}
    </nav>
  );
}
