import type { CSSProperties } from 'react';
import { cn } from '../../utils/cn';
import { TwinleafSpinner } from './TwinleafSpinner';
import styles from './TwinleafPlayButton.module.css';

export type TwinleafPlayButtonProps = {
  text?: string;
  inQueue?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onCooldown?: boolean;
  cooldownSeconds?: number;
  connectionError?: boolean;
  width?: string;
  height?: string;
  fontSize?: string;
  className?: string;
  onClick?: () => void;
};

export function TwinleafPlayButton({
  text = 'FIND MATCH',
  inQueue = false,
  loading = false,
  disabled = false,
  onCooldown = false,
  cooldownSeconds = 0,
  connectionError = false,
  width = '240px',
  height = '60px',
  fontSize = '14px',
  className,
  onClick,
}: TwinleafPlayButtonProps) {
  const isDisabled = disabled || loading || connectionError || onCooldown;

  let buttonText = text;
  if (inQueue) {
    buttonText = 'LEAVE QUEUE';
  } else if (onCooldown) {
    buttonText = `COOLDOWN (${cooldownSeconds})`;
  }

  const style: CSSProperties = { width, height, fontSize };

  return (
    <button
      type="button"
      className={cn(
        styles.button,
        inQueue && styles.inQueue,
        connectionError && styles.error,
        className,
      )}
      style={style}
      disabled={isDisabled}
      onClick={() => {
        if (!isDisabled) {
          onClick?.();
        }
      }}
    >
      {loading ? <TwinleafSpinner size={20} /> : null}
      {buttonText}
    </button>
  );
}
