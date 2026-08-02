import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoreSession } from '../context/CoreSessionContext';
import { MatchmakingLobby } from '../games/MatchmakingLobby';
import styles from './GamesPage.module.css';

export function GamesPage() {
  const { t } = useTranslation();
  const { connected, error } = useCoreSession();
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.cornerTL} aria-hidden />
      <div className={styles.cornerBR} aria-hidden />
      <div className={styles.dots} aria-hidden />
      <div className={styles.alerts}>
        {!connected && (
          <p className={styles.alert}>
            {error ? t('REACT_SOCKET_PREFIX', { message: error }) : t('REACT_CONNECTING')}
          </p>
        )}
        {toast ? <p className={styles.alert}>{toast}</p> : null}
      </div>

      <div className={styles.surface}>
        <MatchmakingLobby onError={setToast} />
      </div>
    </div>
  );
}
