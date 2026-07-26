import { cn } from '../utils/cn';
import styles from './QueueOverlayBanner.module.css';

export type QueueOverlayBannerProps = {
  children: React.ReactNode;
  absolute?: boolean;
  className?: string;
};

export function QueueOverlayBanner({ children, absolute = false, className }: QueueOverlayBannerProps) {
  return (
    <div className={cn(styles.banner, absolute && styles.absolute, className)} role="status">
      {children}
    </div>
  );
}
