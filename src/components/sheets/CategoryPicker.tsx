import type { BlockCategory } from '../../types';
import { CATEGORIES, CATEGORY_LABELS } from '../../types';

interface CategoryPickerProps {
  selected: BlockCategory;
  onSelect: (category: BlockCategory) => void;
}

/** Wrapping pill chips for all 7 categories — equal visual weight, single-select. */
export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  return (
    <div className="ss-sheet-cats">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className={`ss-sheet-cat ${category === selected ? 'ss-sheet-cat--sel' : ''}`.trim()}
          onClick={() => onSelect(category)}
          aria-pressed={category === selected}
        >
          {CATEGORY_LABELS[category]}
        </button>
      ))}
    </div>
  );
}
