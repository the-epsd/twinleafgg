import { cn } from '../../utils/cn';
import styles from './ShellButton.module.css';

export type ShellButtonVariant = 'primary' | 'secondary' | 'plain';

const variantClass: Record<ShellButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  plain: styles.plain,
};

export type ShellButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ShellButtonVariant;
};

export function ShellButton({ variant = 'primary', className, type = 'button', ...props }: ShellButtonProps) {
  return (
    <button
      type={type}
      className={cn(styles.base, variantClass[variant], className)}
      {...props}
    />
  );
}
