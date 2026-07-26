import { cn } from '../utils/cn';
import styles from './StatusIndicator.module.css';

export type StatusIndicatorProps = {
  online?: boolean;
  pulse?: boolean;
  className?: string;
};

export function StatusIndicator({ online = false, pulse = false, className }: StatusIndicatorProps) {
  return (
    <div
      className={cn(
        styles.dot,
        online ? styles.online : styles.offline,
        pulse && styles.pulse,
        className,
      )}
      aria-hidden
    />
  );
}
