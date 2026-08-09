import { useEffect, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { playSfx } from '../../sfx';

export type ModalProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Disable open/close SFX. */
  silent?: boolean;
};

/**
 * Dialog surface that plays modal open/close SFX on mount/unmount.
 * Keep existing panel/overlay classes via `className`.
 */
export function Modal({ children, className, silent = false, role = 'dialog', ...props }: ModalProps) {
  useEffect(() => {
    if (silent) {
      return;
    }
    playSfx('uiModalOpen');
    return () => {
      playSfx('uiModalClose');
    };
  }, [silent]);

  return (
    <div role={role} aria-modal="true" className={cn(className)} {...props}>
      {children}
    </div>
  );
}
