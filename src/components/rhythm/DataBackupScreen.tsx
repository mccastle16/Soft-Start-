import { useRef, useState } from 'react';
import './Rhythm.css';
import '../firstrun/FirstRun.css';
import { downloadBackup, importBackupJson } from '../../db/backup';
import { updateSettings } from '../../db/repository';
import type { AppSettings } from '../../types';
import { AppWordmark } from '../today/AppWordmark';
import { InlineNote } from '../today/InlineNote';
import { ScreenHeader } from '../today/ScreenHeader';
import { ChevronLeftIcon } from '../today/icons';

interface DataBackupScreenProps {
  settings: AppSettings;
  onBack: () => void;
}

/** Crossing this many template edits since the last export/import surfaces N3, the backup whisper (edge case 18). */
const WHISPER_THRESHOLD = 5;

/** S3.3 — manual JSON export/import, the only recovery path if the browser's storage is ever cleared or the phone replaced (edge case 18). */
export function DataBackupScreen({ settings, onBack }: DataBackupScreenProps) {
  const [dismissed, setDismissed] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showWhisper = !dismissed && (settings.templateEditsSinceBackup ?? 0) >= WHISPER_THRESHOLD;

  async function handleExport() {
    await downloadBackup();
    await updateSettings({ templateEditsSinceBackup: 0 });
    setDismissed(true);
  }

  async function handleImportFile(file: File) {
    setImporting(true);
    setImportError(null);
    try {
      const text = await file.text();
      await importBackupJson(text);
      await updateSettings({ templateEditsSinceBackup: 0 });
      onBack();
    } catch {
      setImportError("That file doesn't look like a Soft Start backup.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="ss-screen ss-rhythm-enter">
      <AppWordmark />
      <button type="button" className="ss-back-row" onClick={onBack}>
        <ChevronLeftIcon />
        <span>Rhythm</span>
      </button>

      <ScreenHeader title="Data & backup" subtitle="Local-first, on this device" />

      <div className="ss-fr-sub">Everything lives on this device — no account, no server.</div>

      {showWhisper && (
        <InlineNote
          message="A lot of good changes — want a backup file?"
          primaryLabel="Export"
          onPrimary={handleExport}
          secondaryLabel="Dismiss"
          onSecondary={() => setDismissed(true)}
        />
      )}

      <button type="button" className="ss-sheet-btn ss-sheet-btn--sec ss-rhythm-backup-btn" onClick={handleExport}>
        Export backup file (.json)
      </button>

      <button
        type="button"
        className="ss-sheet-btn ss-sheet-btn--sec ss-rhythm-backup-btn"
        disabled={importing}
        onClick={() => fileInputRef.current?.click()}
      >
        Import a backup…
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="ss-rhythm-file-input"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleImportFile(file);
          event.target.value = '';
        }}
      />
      {importError && <div className="ss-fr-hint ss-rhythm-import-error">{importError}</div>}

      <div className="ss-arrival-spacer" />
      <div className="ss-fr-hint">This device keeps its own copy — your phone is home base.</div>
    </div>
  );
}
