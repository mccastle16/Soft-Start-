import type { ReactNode } from 'react';

interface IconButtonProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export function IconButton({ label, icon, onClick }: IconButtonProps) {
  return (
    <button type="button" className="ss-icon-btn" aria-label={label} onClick={onClick}>
      {icon}
    </button>
  );
}
