import { cn } from '../../utils/cn';
import styles from './FormAlert.module.css';

export type FormAlertProps = {
  variant?: 'error';
  className?: string;
  children: React.ReactNode;
};

export function FormAlert({ variant = 'error', className, children }: FormAlertProps) {
  if (variant === 'error') {
    return <div className={cn(styles.error, className)}>{children}</div>;
  }
  return <div className={className}>{children}</div>;
}
