import { cn } from '../utils/cn';
import styles from './DeckValidityBadge.module.css';

export type DeckValidityBadgeProps = {
  valid: boolean;
  absolute?: boolean;
  className?: string;
};

export function DeckValidityBadge({ valid, absolute = false, className }: DeckValidityBadgeProps) {
  return (
    <div
      className={cn(
        styles.badge,
        valid ? styles.valid : styles.invalid,
        absolute && styles.absolute,
        className,
      )}
    >
      {valid ? 'Valid' : 'Invalid'}
    </div>
  );
}
