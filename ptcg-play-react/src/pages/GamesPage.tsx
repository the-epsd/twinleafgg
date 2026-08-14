import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoreSession } from '../context/CoreSessionContext';
import { MatchmakingLobby } from '../games/MatchmakingLobby';
import styles from './GamesPage.module.css';

export function GamesPage() {
  const { t } = useTranslation();
  const { error } = useCoreSession();
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.cornerTL} aria-hidden />
      <div className={styles.cornerBR} aria-hidden />
      <div className={styles.dots} aria-hidden />
      <div className={styles.alerts}>
        {error ? (
          <p className={styles.alert}>{t('REACT_SOCKET_PREFIX', { message: error })}</p>
        ) : null}
        {toast ? <p className={styles.alert}>{toast}</p> : null}
      </div>

      <div className={styles.surface}>
        <MatchmakingLobby onError={setToast} />
      </div>
    </div>
  );
}
