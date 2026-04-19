import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './TextField.module.css';

export type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id: string;
  label: string;
  rootClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, label, rootClassName, labelClassName, inputClassName, className, ...inputProps },
  ref,
) {
  return (
    <div className={cn(styles.root, rootClassName)}>
      <label className={cn(styles.label, labelClassName)} htmlFor={id}>
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className={cn(styles.input, inputClassName, className)}
        {...inputProps}
      />
    </div>
  );
});
