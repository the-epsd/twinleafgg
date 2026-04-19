import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../utils/cn';
import styles from './ShellButton.module.css';
import type { ShellButtonVariant } from './ShellButton';

const variantClass: Record<ShellButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  plain: styles.plain,
};

export type ShellButtonLinkProps = LinkProps & {
  variant?: ShellButtonVariant;
};

export function ShellButtonLink({ variant = 'primary', className, ...props }: ShellButtonLinkProps) {
  return <Link className={cn(styles.base, variantClass[variant], className)} {...props} />;
}
