import { forwardRef, useImperativeHandle, useState } from 'react';
import { nextOpenGap } from '../today/blockEdits';
import { TimelineView } from '../today/TimelineView';
import type { TodayPlanPatch } from '../../hooks/useTodayPlan';
import type { DayBlock, TemplateBlock } from '../../types';
import { TemplateBlockSheet } from './TemplateBlockSheet';

export interface TemplateEditorHandle {
  openAdd: () => void;
}

interface TemplateEditorProps {
  blocks: TemplateBlock[];
  dayStartMinute: number;
  dayEndMinute: number;
  onChange: (blocks: TemplateBlock[]) => void;
  /** N2, in this context, widens the weekday's own dayShapeOverride rather than a single day's bounds. */
  onDayBoundsChange?: (dayStartMinute: number, dayEndMinute: number) => void;
}

function toDisplayBlock(block: TemplateBlock): DayBlock {
  return { ...block, status: 'pending', isOneOff: false };
}

function toTemplateBlock(block: DayBlock): TemplateBlock {
  return {
    id: block.id,
    title: block.title,
    category: block.category,
    tier: block.tier,
    startMinute: block.startMinute,
    endMinute: block.endMinute,
    minDurationMinutes: block.minDurationMinutes,
  };
}

/**
 * The shared engine behind S0.4 (Build a day) and S3.1 (Rhythm's weekday editor) — the same
 * proportional timeline, drag/resize/tap gestures, and add/edit sheet as Today, just operating
 * on a template's blocks instead of a specific day's.
 */
export const TemplateEditor = forwardRef<TemplateEditorHandle, TemplateEditorProps>(function TemplateEditor(
  { blocks, dayStartMinute, dayEndMinute, onChange, onDayBoundsChange },
  ref,
) {
  const [adding, setAdding] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({ openAdd: () => setAdding(true) }));

  function handleUpdatePlan(patch: TodayPlanPatch) {
    if (patch.blocks) {
      onChange(patch.blocks.map(toTemplateBlock));
    }
    if (patch.dayStartMinute !== undefined || patch.dayEndMinute !== undefined) {
      onDayBoundsChange?.(patch.dayStartMinute ?? dayStartMinute, patch.dayEndMinute ?? dayEndMinute);
    }
  }

  const editingBlock = editingBlockId ? blocks.find((b) => b.id === editingBlockId) : undefined;
  const gap = nextOpenGap(blocks.map(toDisplayBlock), dayStartMinute, dayEndMinute);

  return (
    <div className="ss-tlwrap">
      <TimelineView
        dayStartMinute={dayStartMinute}
        dayEndMinute={dayEndMinute}
        blocks={blocks.map(toDisplayBlock)}
        onUpdatePlan={handleUpdatePlan}
        onOpenBlockSheet={setEditingBlockId}
      />

      {(adding || editingBlock) && (
        <TemplateBlockSheet
          block={editingBlock}
          defaultStartMinute={gap.startMinute}
          defaultEndMinute={gap.endMinute}
          onClose={() => {
            setAdding(false);
            setEditingBlockId(null);
          }}
          onSave={(block) => {
            const next = editingBlock
              ? blocks.map((b) => (b.id === block.id ? block : b))
              : [...blocks, block];
            onChange(next);
            setAdding(false);
            setEditingBlockId(null);
          }}
          onDelete={
            editingBlock
              ? () => {
                  onChange(blocks.filter((b) => b.id !== editingBlock.id));
                  setEditingBlockId(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
});
