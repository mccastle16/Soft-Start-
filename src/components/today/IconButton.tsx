import type { ReactNode } from 'react';

interface IconButtonProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  size?: 'md' | 'sm';
}

export function IconButton({ label, icon, onClick, size = 'md' }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`ss-icon-btn ${size === 'sm' ? 'ss-icon-btn--sm' : ''}`.trim()}
      aria-label={label}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
