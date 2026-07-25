import type { ButtonHTMLAttributes } from 'react';

type GhostButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** The guilt-free exit — text-only, blush hover, no follow-up. */
export function GhostButton({ className, ...props }: GhostButtonProps) {
  return <button type="button" className={`ss-btn-ghost ${className ?? ''}`.trim()} {...props} />;
}
