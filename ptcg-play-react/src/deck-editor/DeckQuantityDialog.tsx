import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellButton } from '../components/ui/ShellButton';
import styles from './DeckQuantityDialog.module.css';

export type DeckQuantityDialogProps = {
  open: boolean;
  value: number;
  minValue?: number;
  maxValue: number;
  onClose: () => void;
  onConfirm: (count: number) => void;
};

export function DeckQuantityDialog({
  open,
  value,
  minValue = 0,
  maxValue,
  onClose,
  onConfirm,
}: DeckQuantityDialogProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(String(value));

  useEffect(() => {
    if (!open) {
      return;
    }
    setText(String(value));
    const id = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, value]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const submit = useCallback(() => {
    if (text.trim() === '') {
      onClose();
      return;
    }
    const parsed = parseInt(text, 10);
    if (!Number.isFinite(parsed)) {
      onClose();
      return;
    }
    const clamped = Math.min(maxValue, Math.max(minValue, parsed));
    onConfirm(clamped);
    onClose();
  }, [text, minValue, maxValue, onConfirm, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="deck-quantity-dialog-title">
        <h2 id="deck-quantity-dialog-title" className={styles.title}>
          {t('DECK_EDIT_HOW_MANY_CARDS')}
        </h2>
        <div className={styles.content}>
          <input
            ref={inputRef}
            type="number"
            className={styles.input}
            value={text}
            min={minValue}
            max={maxValue}
            inputMode="numeric"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
            }}
          />
        </div>
        <div className={styles.footer}>
          <ShellButton type="button" variant="secondary" onClick={onClose}>
            {t('BUTTON_CANCEL')}
          </ShellButton>
          <ShellButton type="button" onClick={submit}>
            {t('BUTTON_OK')}
          </ShellButton>
        </div>
      </div>
    </div>
  );
}
