import { useTranslation } from 'react-i18next';
import styles from './AdminSpectatorControls.module.css';

export type AdminSpectatorReveal = {
  revealPrizes: boolean;
  revealHands: boolean;
};

export type AdminSpectatorControlsProps = {
  reveal: AdminSpectatorReveal;
  onRevealChange: (next: AdminSpectatorReveal) => void;
};

export function AdminSpectatorControls(props: AdminSpectatorControlsProps) {
  const { t } = useTranslation();
  const { reveal, onRevealChange } = props;

  return (
    <div className={styles.root} aria-label={t('TABLE_ADMIN_SPECTATOR_CONTROLS', 'Admin spectator controls')}>
      <div className={styles.title}>{t('TABLE_ADMIN_SPECTATOR_TITLE', 'Spectator view')}</div>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={reveal.revealPrizes}
          onChange={(e) => onRevealChange({ ...reveal, revealPrizes: e.target.checked })}
        />
        <span>{t('TABLE_ADMIN_SPECTATOR_REVEAL_PRIZES', 'Reveal prize cards')}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={reveal.revealHands}
          onChange={(e) => onRevealChange({ ...reveal, revealHands: e.target.checked })}
        />
        <span>{t('TABLE_ADMIN_SPECTATOR_REVEAL_HANDS', 'Reveal hands')}</span>
      </label>
    </div>
  );
}
