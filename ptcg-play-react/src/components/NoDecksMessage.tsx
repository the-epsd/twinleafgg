import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import styles from './NoDecksMessage.module.css';

export type NoDecksMessageProps = {
  message?: string;
  action?: ReactNode;
  className?: string;
};

export function NoDecksMessage({
  message = 'No decks found for this format',
  action,
  className,
}: NoDecksMessageProps) {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.icon} aria-hidden>
        ℹ
      </div>
      <p className={styles.message}>{message}</p>
      {action ? <div className={styles.actions}>{action}</div> : null}
    </div>
  );
}
