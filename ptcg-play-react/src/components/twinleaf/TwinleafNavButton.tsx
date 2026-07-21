import type { CSSProperties } from 'react';
import { cn } from '../../utils/cn';
import styles from './TwinleafNavButton.module.css';

export type TwinleafNavDirection = 'previous' | 'next';

export type TwinleafNavButtonProps = {
  direction: TwinleafNavDirection;
  disabled?: boolean;
  size?: string;
  title?: string;
  className?: string;
  onClick?: () => void;
};

function NavIcon({ direction }: { direction: TwinleafNavDirection }) {
  if (direction === 'previous') {
    return (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    );
  }
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
  );
}

export function TwinleafNavButton({
  direction,
  disabled = false,
  size = '48px',
  title,
  className,
  onClick,
}: TwinleafNavButtonProps) {
  const style: CSSProperties = { width: size, height: size };

  return (
    <button
      type="button"
      className={cn(styles.button, className)}
      style={style}
      disabled={disabled}
      title={title}
      aria-label={title ?? (direction === 'previous' ? 'Previous' : 'Next')}
      onClick={() => {
        if (!disabled) {
          onClick?.();
        }
      }}
    >
      <NavIcon direction={direction} />
    </button>
  );
}

export function TwinleafPreviousButton(props: Omit<TwinleafNavButtonProps, 'direction'>) {
  return <TwinleafNavButton direction="previous" {...props} />;
}

export function TwinleafNextButton(props: Omit<TwinleafNavButtonProps, 'direction'>) {
  return <TwinleafNavButton direction="next" {...props} />;
}
