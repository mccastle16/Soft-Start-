import type { BlockCategory } from '../types';

/** The CSS class slug for each category — shared between CategoryTag (pills) and MiniBlockMarks (week bars). */
export const CATEGORY_TAG_CLASS: Record<BlockCategory, string> = {
  'ease-in': 'easein',
  work: 'work',
  'side-project': 'side',
  spanish: 'spanish',
  workout: 'workout',
  life: 'life',
  other: 'other',
};
