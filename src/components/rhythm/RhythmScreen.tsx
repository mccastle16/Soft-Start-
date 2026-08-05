import { useEffect, useState } from 'react';
import './Rhythm.css';
import '../firstrun/FirstRun.css';
import { getAllDayTemplates, getSettings } from '../../db/repository';
import { WEEKDAY_LABELS } from '../../lib/weekdayLabels';
import { WEEKDAYS, WEEKEND_DAYS, type AppSettings, type DayTemplate, type Weekday } from '../../types';
import { AppWordmark } from '../today/AppWordmark';
import { TabBar, type TabKey } from '../today/TabBar';
import { SettingsRow } from '../firstrun/SettingsRow';
import { DataBackupScreen } from './DataBackupScreen';
import { DayShapeSettingsScreen } from './DayShapeSettingsScreen';
import { WeekdayTemplateScreen } from './WeekdayTemplateScreen';

interface RhythmScreenProps {
  onNavigate: (tab: TabKey) => void;
}

type RhythmView = { kind: 'home' } | { kind: 'weekday'; weekday: Weekday } | { kind: 'dayShape' } | { kind: 'backup' };

function templateHint(template: DayTemplate | undefined, weekday: Weekday): string {
  const count = template?.blocks.length ?? 0;
  if (count === 0 && WEEKEND_DAYS.includes(weekday)) return 'blank by default';
  return `${count} ${count === 1 ? 'block' : 'blocks'}`;
}

/** S3 — Rhythm home: the weekday template list plus Day shape (S3.2) and Data & backup (S3.3). Template edits apply from tomorrow; today never shifts underfoot (edge 16). */
export function RhythmScreen({ onNavigate }: RhythmScreenProps) {
  const [templates, setTemplates] = useState<DayTemplate[] | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [view, setView] = useState<RhythmView>({ kind: 'home' });

  useEffect(() => {
    void getAllDayTemplates().then(setTemplates);
    void getSettings().then(setSettings);
  }, []);

  if (!templates || !settings) {
    return <div className="ss-screen" />;
  }

  function goHome() {
    void getAllDayTemplates().then(setTemplates);
    void getSettings().then(setSettings);
    setView({ kind: 'home' });
  }

  if (view.kind === 'weekday') {
    return (
      <WeekdayTemplateScreen
        weekday={view.weekday}
        template={templates.find((t) => t.weekday === view.weekday)}
        dayShape={settings.dayShape}
        onBack={goHome}
      />
    );
  }

  if (view.kind === 'dayShape') {
    return <DayShapeSettingsScreen dayShape={settings.dayShape} onBack={goHome} />;
  }

  if (view.kind === 'backup') {
    return <DataBackupScreen settings={settings} onBack={goHome} />;
  }

  const templatesByWeekday = new Map(templates.map((t) => [t.weekday, t]));

  return (
    <div className="ss-screen ss-screen--tabbed ss-rhythm-enter ss-rhythm-enter--back">
      <AppWordmark />
      <div className="ss-rhythm-hdr">
        <h2>Rhythm</h2>
      </div>

      <div className="ss-rhythm-scroll">
        <div className="ss-rhythm-section">Weekday templates</div>
        {WEEKDAYS.map((weekday) => (
          <SettingsRow
            key={weekday}
            variant="nav"
            label={WEEKDAY_LABELS[weekday]}
            hint={templateHint(templatesByWeekday.get(weekday), weekday)}
            onClick={() => setView({ kind: 'weekday', weekday })}
          />
        ))}

        <div className="ss-rhythm-section">Settings</div>
        <SettingsRow variant="nav" label="Day shape" hint="" onClick={() => setView({ kind: 'dayShape' })} />
        <SettingsRow variant="nav" label="Data & backup" hint="" onClick={() => setView({ kind: 'backup' })} />
      </div>

      <TabBar active="rhythm" onSelect={onNavigate} />
    </div>
  );
}
