import { cn } from '../utils/cn';
import styles from './LoadingSpinner.module.css';

export type LoadingSpinnerProps = {
  size?: number;
  overlay?: boolean;
  className?: string;
};

export function LoadingSpinner({ size = 65, overlay = false, className }: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn(styles.root, className)}>
      <svg
        className={styles.spinner}
        width={size}
        height={size}
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle className={styles.path} fill="none" strokeWidth="6" cx="33" cy="33" r="30" />
      </svg>
    </div>
  );

  if (overlay) {
    return <div className={styles.overlay}>{spinner}</div>;
  }

  return spinner;
}
