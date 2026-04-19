import { cn } from '../../utils/cn';
import styles from './CheckboxField.module.css';

export type CheckboxFieldProps = {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  id?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
};

export function CheckboxField({
  checked,
  onChange,
  children,
  id,
  className,
  inputClassName,
  disabled,
}: CheckboxFieldProps) {
  return (
    <label className={cn(styles.label, className)} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className={inputClassName}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {children}
    </label>
  );
}
