import { cn } from '../utils/cn';
import styles from './HoverHighlight.module.css';

export function HoverHighlight({
  enabled,
  children,
  onClick,
  className,
}: {
  enabled: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(styles.root, enabled && styles.enabled, className)}
      onClick={enabled ? onClick : undefined}
      onKeyDown={
        enabled && onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={enabled ? 'button' : undefined}
      tabIndex={enabled ? 0 : undefined}
    >
      {children}
    </div>
  );
}
