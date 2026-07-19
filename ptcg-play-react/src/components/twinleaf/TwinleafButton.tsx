import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { TwinleafSpinner } from './TwinleafSpinner';
import styles from './TwinleafButton.module.css';

export type TwinleafButtonColor = 'primary' | 'secondary' | 'accent';
export type TwinleafButtonSize = 'small' | 'normal' | 'large';

export type TwinleafButtonProps = {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  color?: TwinleafButtonColor;
  size?: TwinleafButtonSize;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
};

export function TwinleafButton({
  text,
  disabled = false,
  loading = false,
  icon,
  color = 'primary',
  size = 'normal',
  fullWidth = false,
  type = 'button',
  className,
  onClick,
}: TwinleafButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={cn(
        styles.button,
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      )}
      disabled={isDisabled}
      onClick={() => {
        if (!isDisabled) {
          onClick?.();
        }
      }}
      data-color={color}
    >
      {loading ? <TwinleafSpinner size={16} /> : null}
      {!loading && icon ? icon : null}
      <span>{text}</span>
    </button>
  );
}
