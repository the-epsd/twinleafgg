import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './TwinleafCtaButton.module.css';

export type TwinleafCtaVariant = 'primary' | 'muted' | 'gold';

export type TwinleafCtaButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: TwinleafCtaVariant;
  fullWidth?: boolean;
};

const variantClass: Record<Exclude<TwinleafCtaVariant, 'primary'>, string> = {
  muted: styles.muted,
  gold: styles.gold,
};

/** Shared Twinleaf CTA — asymmetric radius, solid brand fill, white label text. */
export function TwinleafCtaButton({
  variant = 'primary',
  fullWidth = false,
  className,
  type = 'button',
  children,
  ...props
}: TwinleafCtaButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        styles.button,
        variant !== 'primary' && variantClass[variant],
        fullWidth && styles.fullWidth,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export const twinleafCtaLabelStyles = {
  label: styles.label,
  labelHidden: styles.labelHidden,
};
