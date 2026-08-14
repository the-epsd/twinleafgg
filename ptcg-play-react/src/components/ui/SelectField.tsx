import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { playSfx } from '../../sfx';

export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  /** Disable dropdown SFX for this instance. */
  silent?: boolean;
};

/**
 * Native `<select>` with PTCGO dropnav SFX.
 * Pass `className` to keep page-specific styling.
 */
export function SelectField({
  silent = false,
  className,
  onChange,
  onMouseDown,
  ...props
}: SelectFieldProps) {
  return (
    <select
      className={cn(className)}
      onMouseDown={(e) => {
        if (!silent && !props.disabled) {
          playSfx('uiDropnav');
        }
        onMouseDown?.(e);
      }}
      onChange={(e) => {
        onChange?.(e);
      }}
      {...props}
    />
  );
}
