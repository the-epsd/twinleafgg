import { cn } from '../utils/cn';
import styles from './FormatTabButton.module.css';

export type FormatTabButtonProps = {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function FormatTabButton({ active = false, children, className, onClick }: FormatTabButtonProps) {
  return (
    <button
      type="button"
      className={cn(styles.tab, active && styles.active, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
