import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import styles from './SnackbarHost.module.css';

export type SnackbarVariant = 'info' | 'error';

export type ShowSnackbarOptions = {
  variant?: SnackbarVariant;
  /** Defaults to 3000ms. */
  durationMs?: number;
};

type SnackbarContextValue = {
  showSnackbar: (message: string, options?: ShowSnackbarOptions) => void;
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; variant: SnackbarVariant } | null>(null);
  const timerRef = useRef<ReturnType<typeof window.setTimeout> | undefined>(undefined);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  };

  const showSnackbar = useCallback((message: string, options?: ShowSnackbarOptions) => {
    const variant = options?.variant ?? 'info';
    const durationMs = options?.durationMs ?? 3000;
    clearTimer();
    setToast({ message, variant });
    timerRef.current = window.setTimeout(() => {
      setToast(null);
      timerRef.current = undefined;
    }, durationMs);
  }, []);

  useEffect(() => () => clearTimer(), []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {toast ? (
        <div
          className={`${styles.snackbar} ${toast.variant === 'error' ? styles.error : styles.info}`}
          role="status"
        >
          {toast.message}
        </div>
      ) : null}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return ctx;
}
