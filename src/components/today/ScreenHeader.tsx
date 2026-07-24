import type { ReactNode } from 'react';

interface ScreenHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function ScreenHeader({ title, subtitle, actions }: ScreenHeaderProps) {
  return (
    <div className="ss-hdr">
      <div>
        <h2>{title}</h2>
        <div className="ss-hdr-sub">{subtitle}</div>
      </div>
      {actions && <div className="ss-hdr-actions">{actions}</div>}
    </div>
  );
}
