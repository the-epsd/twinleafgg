import { cn } from '../../utils/cn';
import { playSfx } from '../../sfx';
import styles from './CheckboxField.module.css';

export type CheckboxFieldProps = {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  id?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  /**
   * When true, skips default label chrome so page-specific `className` styles apply alone.
   */
  plain?: boolean;
  /** Disable checkbox SFX for this instance. */
  silent?: boolean;
};

export function CheckboxField({
  checked,
  onChange,
  children,
  id,
  className,
  inputClassName,
  disabled,
  plain = false,
  silent = false,
}: CheckboxFieldProps) {
  return (
    <label className={plain ? className : cn(styles.label, className)} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className={inputClassName}
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          if (!silent && !disabled) {
            playSfx(e.target.checked ? 'uiCheckboxOn' : 'uiCheckboxOff');
          }
          onChange(e);
        }}
      />
      {children}
    </label>
  );
}
