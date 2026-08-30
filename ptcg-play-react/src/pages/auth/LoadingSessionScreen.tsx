import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import authStyles from './AuthShell.module.css';
import styles from './LoadingSessionScreen.module.css';

export function LoadingSessionScreen() {
  const { t } = useTranslation();

  return (
    <div
      className={authStyles.screen}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={t('PROTECTED_LOADING_SESSION')}
    >
      <div className={authStyles.cornerTL} aria-hidden />
      <div className={authStyles.cornerBR} aria-hidden />
      <div className={authStyles.dots} aria-hidden />
      <LoadingSpinner size={72} className={styles.spinner} />
    </div>
  );
}
