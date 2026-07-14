import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoreSession } from '../context/CoreSessionContext';
import styles from './ConnectionStatusSnackbar.module.css';

type BannerState =
  | { kind: 'hidden' }
  | { kind: 'reconnecting'; attempt: number }
  | { kind: 'disconnected' }
  | { kind: 'failed' }
  | { kind: 'reconnected' };

/**
 * Top-right snackbar for socket disconnect / reconnect status.
 * Only visible while authenticated (mounted under CoreSessionProvider).
 */
export function ConnectionStatusSnackbar() {
  const { t } = useTranslation();
  const { connected, connectionBanner } = useCoreSession();
  const [banner, setBanner] = useState<BannerState>({ kind: 'hidden' });
  const hadIssueRef = useRef(false);
  const hideTimerRef = useRef<ReturnType<typeof window.setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current != null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hideTimerRef.current != null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = undefined;
    }

    if (connectionBanner?.type === 'reconnecting') {
      hadIssueRef.current = true;
      setBanner({ kind: 'reconnecting', attempt: connectionBanner.attempt });
      return;
    }

    if (connectionBanner?.type === 'disconnected') {
      hadIssueRef.current = true;
      setBanner({ kind: 'disconnected' });
      return;
    }

    if (connectionBanner?.type === 'failed') {
      hadIssueRef.current = true;
      setBanner({ kind: 'failed' });
      return;
    }

    // Restored after a drop — brief success toast
    if (connected && hadIssueRef.current) {
      hadIssueRef.current = false;
      setBanner({ kind: 'reconnected' });
      hideTimerRef.current = window.setTimeout(() => {
        setBanner({ kind: 'hidden' });
        hideTimerRef.current = undefined;
      }, 2800);
      return;
    }

    if (connected) {
      setBanner({ kind: 'hidden' });
    }
  }, [connected, connectionBanner]);

  if (banner.kind === 'hidden') {
    return null;
  }

  let message: string;
  let variantClass: string;
  switch (banner.kind) {
    case 'reconnecting':
      message = t('SOCKET_RECONNECTING', {
        attempt: banner.attempt,
        defaultValue: `Reconnecting… (Attempt ${banner.attempt})`,
      });
      variantClass = styles.warn;
      break;
    case 'disconnected':
      message = t('SOCKET_DISCONNECTED', { defaultValue: 'Disconnected from server' });
      variantClass = styles.error;
      break;
    case 'failed':
      message = t('SOCKET_RECONNECT_FAILED', { defaultValue: 'Failed to reconnect to server' });
      variantClass = styles.error;
      break;
    case 'reconnected':
      message = t('SOCKET_RECONNECTED', { defaultValue: 'Reconnected successfully' });
      variantClass = styles.ok;
      break;
  }

  return (
    <div className={`${styles.snackbar} ${variantClass}`} role="status" aria-live="polite">
      <span className={styles.dot} aria-hidden />
      <span>{message}</span>
    </div>
  );
}
