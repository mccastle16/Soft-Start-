import type { ButtonHTMLAttributes } from 'react';

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** Pill button reserved for "begin" moments (Set my intention, Add something). */
export function PrimaryButton({ className, ...props }: PrimaryButtonProps) {
  return <button type="button" className={`ss-btn-primary ${className ?? ''}`.trim()} {...props} />;
}
