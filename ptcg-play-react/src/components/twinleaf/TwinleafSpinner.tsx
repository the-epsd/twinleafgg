import styles from './TwinleafSpinner.module.css';

export type TwinleafSpinnerProps = {
  size?: number;
  className?: string;
};

export function TwinleafSpinner({ size = 16, className }: TwinleafSpinnerProps) {
  return (
    <svg
      className={`${styles.spinner}${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle className={styles.path} fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30" />
    </svg>
  );
}
