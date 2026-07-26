import { cn } from '../utils/cn';
import styles from './BattleStatusBadge.module.css';

export type BattleStatusBadgeVariant = 'friend' | 'blocked' | 'pending';

export type BattleStatusBadgeProps = {
  variant?: BattleStatusBadgeVariant;
  children: React.ReactNode;
  className?: string;
};

export function BattleStatusBadge({
  variant = 'friend',
  children,
  className,
}: BattleStatusBadgeProps) {
  return (
    <span
      className={cn(
        styles.badge,
        variant === 'blocked' && styles.blocked,
        variant === 'pending' && styles.pending,
        className,
      )}
    >
      {children}
    </span>
  );
}
