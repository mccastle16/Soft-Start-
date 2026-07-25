import type { InputHTMLAttributes } from 'react';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement>;

/** One-line input with the rose focus halo; faint rose-gray placeholder. */
export function TextField({ className, ...props }: TextFieldProps) {
  return <input type="text" className={`ss-field ${className ?? ''}`.trim()} {...props} />;
}
