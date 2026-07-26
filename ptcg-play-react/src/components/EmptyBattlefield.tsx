import { cn } from '../utils/cn';
import styles from './EmptyBattlefield.module.css';

export type EmptyBattlefieldProps = {
  title?: string;
  description?: string;
  hint?: string;
  className?: string;
};

export function EmptyBattlefield({
  title = 'Battle Network Offline',
  description = 'No trainers connected to your network yet.',
  hint = 'Send friend requests to expand your battle network and challenge other trainers!',
  className,
}: EmptyBattlefieldProps) {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.visual}>
        <div className={styles.hologram}>
          <svg className={styles.hologramIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.47 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm2.78 1.58c-.85-.37-1.79-.58-2.78-.58-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57c0-.81-.48-1.53-1.22-1.85zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
          </svg>
        </div>
      </div>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.hint}>{hint}</div>
      </div>
    </div>
  );
}
