import { cn } from '../../utils/cn';
import { playSfx } from '../../sfx';
import styles from './ShellIconButton.module.css';

export type ShellIconButtonVariant = 'green';

const variantClass: Record<ShellIconButtonVariant, string> = {
  green: styles.green,
};

export type ShellIconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ShellIconButtonVariant;
  silent?: boolean;
};

export function ShellIconButton({
  variant = 'green',
  className,
  type = 'button',
  silent = false,
  onClick,
  disabled,
  ...props
}: ShellIconButtonProps) {
  return (
    <button
      type={type}
      className={cn(styles.button, variantClass[variant], className)}
      disabled={disabled}
      onClick={(e) => {
        if (!silent && !disabled) {
          playSfx('uiButton');
        }
        onClick?.(e);
      }}
      {...props}
    />
  );
}
