import { useEffect, useRef, useState } from 'react';
import './Rhythm.css';
import '../firstrun/FirstRun.css';
import { incrementTemplateEditsSinceBackup, saveDayTemplate } from '../../db/repository';
import { WEEKDAY_LABELS } from '../../lib/weekdayLabels';
import type { DayShape, DayTemplate, TemplateBlock, Weekday } from '../../types';
import { AppWordmark } from '../today/AppWordmark';
import { IconButton } from '../today/IconButton';
import { ScreenHeader } from '../today/ScreenHeader';
import { ChevronLeftIcon, PlusIcon } from '../today/icons';
import { DuplicateDaySheet } from './DuplicateDaySheet';
import { TemplateEditor, type TemplateEditorHandle } from './TemplateEditor';

interface WeekdayTemplateScreenProps {
  weekday: Weekday;
  template: DayTemplate | undefined;
  dayShape: DayShape;
  onBack: () => void;
}

/** S3.1 — the same build engine as first-run's Build Monday (TemplateEditor), reached from Rhythm; edits save immediately and apply from tomorrow (edge 16). */
export function WeekdayTemplateScreen({ weekday, template, dayShape, onBack }: WeekdayTemplateScreenProps) {
  const [blocks, setBlocks] = useState<TemplateBlock[]>(template?.blocks ?? []);
  const [dayShapeOverride, setDayShapeOverride] = useState(template?.dayShapeOverride);
  const [duplicating, setDuplicating] = useState(false);
  const dirtyRef = useRef(false);
  const editorRef = useRef<TemplateEditorHandle>(null);

  const weekdayLabel = WEEKDAY_LABELS[weekday];
  const effectiveDayShape = { ...dayShape, ...dayShapeOverride };

  useEffect(
    () => () => {
      if (dirtyRef.current) void incrementTemplateEditsSinceBackup();
    },
    [],
  );

  function persist(nextBlocks: TemplateBlock[], nextOverride: typeof dayShapeOverride) {
    dirtyRef.current = true;
    setBlocks(nextBlocks);
    setDayShapeOverride(nextOverride);
    void saveDayTemplate({ weekday, blocks: nextBlocks, dayShapeOverride: nextOverride });
  }

  return (
    <div className="ss-screen ss-rhythm-enter">
      <AppWordmark />
      <button type="button" className="ss-back-row" onClick={onBack}>
        <ChevronLeftIcon />
        <span>Rhythm</span>
      </button>

      <ScreenHeader
        title={weekdayLabel}
        subtitle="Weekday template"
        actions={<IconButton label="Add a block" icon={<PlusIcon />} onClick={() => editorRef.current?.openAdd()} />}
      />

      <TemplateEditor
        ref={editorRef}
        blocks={blocks}
        dayStartMinute={effectiveDayShape.dayStartMinute}
        dayEndMinute={effectiveDayShape.dayEndMinute}
        onChange={(next) => persist(next, dayShapeOverride)}
        onDayBoundsChange={(dayStartMinute, dayEndMinute) =>
          persist(blocks, { ...dayShapeOverride, dayStartMinute, dayEndMinute })
        }
      />

      <div className="ss-rhythm-footer">
        <button type="button" className="ss-rhythm-footer-btn" onClick={() => setDuplicating(true)}>
          Duplicate this day…
        </button>
        <button type="button" className="ss-rhythm-footer-btn ss-rhythm-footer-btn--primary" onClick={onBack}>
          Done
        </button>
      </div>

      {duplicating && (
        <DuplicateDaySheet sourceWeekday={weekday} sourceBlocks={blocks} onClose={() => setDuplicating(false)} />
      )}
    </div>
  );
}
