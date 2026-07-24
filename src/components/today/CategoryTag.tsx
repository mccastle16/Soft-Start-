import type { BlockCategory, BlockStatus, BlockTier } from '../../types';
import { CATEGORY_LABELS } from '../../types';

interface CategoryTagProps {
  category: BlockCategory;
  tier: BlockTier;
  status: BlockStatus;
}

const CATEGORY_TAG_CLASS: Record<BlockCategory, string> = {
  'ease-in': 'easein',
  work: 'work',
  'side-project': 'side',
  spanish: 'spanish',
  workout: 'workout',
  life: 'life',
  other: 'other',
};

/**
 * Priority mirrors the design system's color-semantics law: done (sage) always
 * wins, then the anchored/protected quiet tags, and only otherwise does the
 * block show its category color. Sage never appears for anything but "done".
 */
export function CategoryTag({ category, tier, status }: CategoryTagProps) {
  if (status === 'done') {
    return (
      <span className="ss-tag ss-tag--done">
        <span className="ss-dot" />
        done
      </span>
    );
  }
  if (tier === 'anchored') {
    return <span className="ss-tag ss-tag--anchored">anchored</span>;
  }
  if (tier === 'protected') {
    return <span className="ss-tag ss-tag--quiet">protected</span>;
  }
  return (
    <span className={`ss-tag ss-tag--${CATEGORY_TAG_CLASS[category]}`}>
      <span className="ss-dot" />
      {CATEGORY_LABELS[category]}
    </span>
  );
}
