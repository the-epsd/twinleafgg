import { useTranslation } from 'react-i18next';
import styles from './SandboxTableHint.module.css';

/** Shown when an admin enables “sandbox” in Settings but this match was not created with sandbox mode. */
export function SandboxTableHint() {
  const { t } = useTranslation();
  return (
    <aside className={styles.hint} aria-label={t('SANDBOX_HINT_TITLE')}>
      <h3 className={styles.title}>{t('SANDBOX_HINT_TITLE')}</h3>
      <p className={styles.body}>{t('REACT_SANDBOX_GAME_NOT_ENABLED_BODY')}</p>
    </aside>
  );
}
