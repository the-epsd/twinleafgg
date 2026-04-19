import { cn } from '../../utils/cn';
import styles from './ShellIconButton.module.css';

export type ShellIconButtonVariant = 'green';

const variantClass: Record<ShellIconButtonVariant, string> = {
  green: styles.green,
};

export type ShellIconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ShellIconButtonVariant;
};

export function ShellIconButton({
  variant = 'green',
  className,
  type = 'button',
  ...props
}: ShellIconButtonProps) {
  return (
    <button
      type={type}
      className={cn(styles.button, variantClass[variant], className)}
      {...props}
    />
  );
}
