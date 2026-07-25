import { useRef, useState } from 'react';
import './FirstRun.css';
import '../today/Today.css';
import '../arrival/Arrival.css';
import { PrimaryButton } from '../arrival/PrimaryButton';
import { IconButton } from '../today/IconButton';
import { PlusIcon } from '../today/icons';
import { TemplateEditor, type TemplateEditorHandle } from '../rhythm/TemplateEditor';
import { WEEKDAY_LABELS } from '../../lib/weekdayLabels';
import type { DayShape, TemplateBlock, Weekday } from '../../types';
import { Stepper } from './Stepper';

interface BuildDayScreenProps {
  weekday: Weekday;
  dayShape: DayShape;
  initialBlocks: TemplateBlock[];
  onDone: (blocks: TemplateBlock[], dayShapeOverride?: Partial<DayShape>) => void;
}

/** S0.4 — the real template editor on the real proportional timeline; teaches the app's whole gesture language before day one. */
export function BuildDayScreen({ weekday, dayShape, initialBlocks, onDone }: BuildDayScreenProps) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [bounds, setBounds] = useState<{ dayStartMinute: number; dayEndMinute: number } | undefined>(undefined);
  const editorRef = useRef<TemplateEditorHandle>(null);

  const weekdayLabel = WEEKDAY_LABELS[weekday];
  const effectiveStart = bounds?.dayStartMinute ?? dayShape.dayStartMinute;
  const effectiveEnd = bounds?.dayEndMinute ?? dayShape.dayEndMinute;

  return (
    <div className="ss-screen">
      <Stepper activeCount={4} />
      <div className="ss-fr-rowbetween">
        <div>
          <div className="ss-fr-h2">Build your {weekdayLabel}</div>
          <div className="ss-fr-sub">Ease-in and lunch are already placed — add your day around them.</div>
        </div>
        <IconButton label="Add a block" icon={<PlusIcon />} onClick={() => editorRef.current?.openAdd()} />
      </div>

      <TemplateEditor
        ref={editorRef}
        blocks={blocks}
        dayStartMinute={effectiveStart}
        dayEndMinute={effectiveEnd}
        onChange={setBlocks}
        onDayBoundsChange={(dayStartMinute, dayEndMinute) => setBounds({ dayStartMinute, dayEndMinute })}
      />

      <PrimaryButton onClick={() => onDone(blocks, bounds)}>{weekdayLabel}'s done</PrimaryButton>
    </div>
  );
}
