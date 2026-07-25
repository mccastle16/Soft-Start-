import { useEffect, useState } from "react";
import { ArrivalFlow } from "./components/arrival/ArrivalFlow";
import { FirstRunFlow } from "./components/firstrun/FirstRunFlow";
import type { TabKey } from "./components/today/TabBar";
import { TodayScreen } from "./components/today/TodayScreen";
import { WeekScreen } from "./components/week/WeekScreen";
import { getSettings, seedDatabase } from "./db/repository";
import { useTodayPlan } from "./hooks/useTodayPlan";
import type { AppSettings } from "./types";

function App() {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    seedDatabase()
      .then(getSettings)
      .then(setSettings);
  }, []);

  if (!settings) {
    return <div className="ss-screen" />;
  }

  if (!settings.hasCompletedFirstRun) {
    return (
      <FirstRunFlow
        settings={settings}
        onComplete={() => setSettings((prev) => (prev ? { ...prev, hasCompletedFirstRun: true } : prev))}
      />
    );
  }

  return <DailyApp />;
}

/** Everything that depends on today already having a plan — deferred until first run has actually built a rhythm. */
function DailyApp() {
  const [plan, updatePlan] = useTodayPlan();
  const [activeTab, setActiveTab] = useState<TabKey>('today');

  if (!plan) {
    return <div className="ss-screen" />;
  }

  if (!plan.ritualCompletedAt) {
    return (
      <ArrivalFlow
        plan={plan}
        onComplete={({ intention, ritualCompletedAt }) => updatePlan({ intention, ritualCompletedAt })}
      />
    );
  }

  function handleNavigate(tab: TabKey) {
    // Rhythm (S3) isn't built yet — the tab stays inert until then.
    if (tab === 'today' || tab === 'week') setActiveTab(tab);
  }

  if (activeTab === 'week') {
    return <WeekScreen onNavigate={handleNavigate} />;
  }

  return <TodayScreen plan={plan} updatePlan={updatePlan} onNavigate={handleNavigate} />;
}

export default App;
