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

export type SnackbarAction = {
  label: string;
  onClick: () => void;
};

export type ShowSnackbarOptions = {
  variant?: SnackbarVariant;
  /** Defaults to 3000 (Angular AlertService.toast). */
  durationMs?: number;
  action?: SnackbarAction;
};

type SnackbarContextValue = {
  showSnackbar: (message: string, options?: ShowSnackbarOptions) => void;
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    variant: SnackbarVariant;
    action?: SnackbarAction;
  } | null>(null);
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
    setToast({ message, variant, action: options?.action });
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
          className={`${styles.snackbar} ${toast.variant === 'error' ? styles.error : styles.info} ${toast.action ? styles.withAction : ''}`}
          role="status"
        >
          <span>{toast.message}</span>
          {toast.action ? (
            <button
              type="button"
              className={styles.action}
              onClick={() => {
                toast.action?.onClick();
                clearTimer();
                setToast(null);
              }}
            >
              {toast.action.label}
            </button>
          ) : null}
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
