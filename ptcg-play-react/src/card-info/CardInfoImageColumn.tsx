import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Card } from 'ptcg-server';
import { CardFace } from '../components/cards';
import { CARDBACK_ASSET_URL } from '../deck-editor/resolveScanUrl';
import { getCardsWithSameName } from './cardInfoUtils';
import styles from './CardInfoPane.module.css';

function IconSwapHoriz() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
    </svg>
  );
}

export type CardInfoImageColumnProps = {
  card: Card;
  catalog: Card[];
  facedown: boolean;
  getScanUrl: (card: Card) => string;
  isInGame: boolean;
  onSwapClick: () => void;
};

export function CardInfoImageColumn({
  card,
  catalog,
  facedown,
  getScanUrl,
  isInGame,
  onSwapClick,
}: CardInfoImageColumnProps) {
  const { t } = useTranslation();
  const alternatives = useMemo(() => getCardsWithSameName(catalog, card), [catalog, card]);
  const scan = getScanUrl(card).trim() || CARDBACK_ASSET_URL;
  const scanSrc = facedown ? CARDBACK_ASSET_URL : scan;

  return (
    <div className={styles.imageCol}>
      <div className={styles.cardScan}>
        <CardFace
          card={facedown ? null : card}
          src={scanSrc}
          name={card.name}
          loading="eager"
          style={{ width: '100%' }}
        />
      </div>
      {!isInGame && !facedown && (
        <div className={styles.swapButtonContainer}>
          <button
            type="button"
            className={styles.swapButton}
            disabled={alternatives.length === 0}
            title={alternatives.length > 0 ? t('SWAP_PRINTING') : t('NO_ALTERNATIVE_PRINTINGS')}
            onClick={() => alternatives.length > 0 && onSwapClick()}
          >
            <IconSwapHoriz />
          </button>
        </div>
      )}
    </div>
  );
}
