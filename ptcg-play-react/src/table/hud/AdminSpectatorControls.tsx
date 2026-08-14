import { useTranslation } from 'react-i18next';
import { CheckboxField } from '../../components/ui/CheckboxField';
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
      <CheckboxField
        plain
        className={styles.checkboxRow}
        checked={reveal.revealPrizes}
        onChange={(e) => onRevealChange({ ...reveal, revealPrizes: e.target.checked })}
      >
        <span>{t('TABLE_ADMIN_SPECTATOR_REVEAL_PRIZES', 'Reveal prize cards')}</span>
      </CheckboxField>
      <CheckboxField
        plain
        className={styles.checkboxRow}
        checked={reveal.revealHands}
        onChange={(e) => onRevealChange({ ...reveal, revealHands: e.target.checked })}
      >
        <span>{t('TABLE_ADMIN_SPECTATOR_REVEAL_HANDS', 'Reveal hands')}</span>
      </CheckboxField>
    </div>
  );
}
