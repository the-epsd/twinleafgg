import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import styles from './FriendActionButton.module.css';

export type FriendActionButtonVariant = 'default' | 'challenge' | 'message' | 'more' | 'unblock';

export type FriendActionButtonProps = {
  variant?: FriendActionButtonVariant;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
};

export function FriendActionButton({
  variant = 'default',
  icon,
  children,
  className,
  disabled,
  onClick,
  'aria-label': ariaLabel,
}: FriendActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        styles.button,
        variant === 'challenge' && styles.challenge,
        variant === 'message' && styles.message,
        variant === 'more' && styles.more,
        variant === 'unblock' && styles.unblock,
        className,
      )}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      {children ? <span className={styles.label}>{children}</span> : null}
    </button>
  );
}
