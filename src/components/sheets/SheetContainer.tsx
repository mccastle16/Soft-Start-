import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface SheetContainerProps {
  title: string;
  headerAccessory?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

/** Bottom sheet (mobile) / centered panel (desktop) over a dimmed, blurred Today — the day stays visible behind everything done to it. */
export function SheetContainer({ title, headerAccessory, onClose, children }: SheetContainerProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="ss-sheet-host">
      <div className="ss-sheet-scrim" onClick={onClose} />
      <div className="ss-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="ss-sheet-handle" />
        <div className="ss-sheet-head">
          <span className="ss-sheet-title">{title}</span>
          {headerAccessory}
        </div>
        {children}
      </div>
    </div>
  );
}
