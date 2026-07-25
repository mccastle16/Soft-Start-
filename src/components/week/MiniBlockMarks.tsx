import { CATEGORY_TAG_CLASS } from '../../lib/categoryStyle';
import { sortByStart } from '../today/blockEdits';
import type { DayBlock } from '../../types';

interface MiniBlockMarksProps {
  blocks: DayBlock[];
}

const PX_PER_MINUTE = 0.45;
const MIN_WIDTH_PX = 14;
const MAX_WIDTH_PX = 90;

function markWidth(block: DayBlock): number {
  const raw = (block.endMinute - block.startMinute) * PX_PER_MINUTE;
  return Math.max(MIN_WIDTH_PX, Math.min(MAX_WIDTH_PX, raw));
}

/** Tiny rounded bars, width ∝ duration — rose-and-cream category pastels, warm gray once done, ringed when anchored. */
export function MiniBlockMarks({ blocks }: MiniBlockMarksProps) {
  if (blocks.length === 0) return null;

  return (
    <div className="ss-week-marks">
      {sortByStart(blocks).map((block) => {
        // Priority mirrors the timeline's own block treatment: done (gray) wins, then the anchor's
        // quiet neutral fill, and only otherwise does the category color show. The ring is a fully
        // separate modifier so it never fights the fill class for the `background` property.
        const fillKey =
          block.status === 'done' ? 'done' : block.tier === 'anchored' ? 'anchor' : CATEGORY_TAG_CLASS[block.category];
        return (
          <span
            key={block.id}
            className={['ss-week-mk', `ss-week-mk--${fillKey}`, block.tier === 'anchored' ? 'ss-week-mk--ring' : '']
              .filter(Boolean)
              .join(' ')}
            style={{ width: markWidth(block) }}
          />
        );
      })}
    </div>
  );
}
