import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Card, CardList } from 'ptcg-server';
import { SuperType as SuperTypeEnum } from 'ptcg-server';
import { CardFace } from '../components/cards/CardFace';
import type { CardInfoPaneOptions, CardInfoTableAction } from './CardInfoPane';
import { CardInfoPopup } from './CardInfoPopup';
import styles from './CardInfoListPopup.module.css';

export type CardInfoListPopupProps = {
  cardList: CardList;
  catalog: Card[];
  getScanUrl: (card: Card) => string;
  facedown?: boolean;
  allowReveal?: boolean;
  options?: CardInfoPaneOptions;
  isInGame?: boolean;
  onClose: () => void;
  onResolve?: (result: CardInfoTableAction & { cardList?: CardList }) => void;
};

function sortCardsForDisplay(cards: Card[]): Card[] {
  return cards.slice().sort((a, b) => {
    const typeOrder = (c: Card): number => {
      if (c.superType === SuperTypeEnum.POKEMON) return 0;
      if (c.superType === SuperTypeEnum.TRAINER) return 1;
      return 2;
    };
    const aType = typeOrder(a);
    const bType = typeOrder(b);
    if (aType !== bType) return aType - bType;
    if (a.set !== b.set) return a.set.localeCompare(b.set);
    return (parseInt(a.setNumber || '0', 10) - parseInt(b.setNumber || '0', 10));
  });
}

export function CardInfoListPopup({
  cardList,
  catalog,
  getScanUrl,
  facedown = false,
  allowReveal = false,
  options,
  isInGame = true,
  onClose,
  onResolve,
}: CardInfoListPopupProps) {
  const { t } = useTranslation();
  const [sortDiscards, setSortDiscards] = useState(false);
  const [originalOrder] = useState(() => cardList.cards.slice());
  const [faceDownState, setFaceDownState] = useState(facedown);
  const [detailCard, setDetailCard] = useState<Card | null>(null);

  const displayCards = useMemo(
    () => (sortDiscards ? sortCardsForDisplay(originalOrder) : originalOrder),
    [sortDiscards, originalOrder],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !detailCard) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, detailCard]);

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && !detailCard && onClose()}
    >
      <div className={styles.panel} role="dialog" aria-modal="true">
        <h2 className={styles.title}>{t('CARDS_LIST_OF_CARDS', 'Cards')}</h2>
        <div className={styles.sortRow}>
          <label>
            <input
              type="checkbox"
              checked={sortDiscards}
              onChange={(e) => setSortDiscards(e.target.checked)}
            />{' '}
            Sort discard
          </label>
          {allowReveal ? (
            <label className={styles.reveal}>
              <input
                type="checkbox"
                checked={!faceDownState}
                onChange={() => setFaceDownState((v) => !v)}
              />{' '}
              {t('CARDS_REVEAL_CARDS')}
            </label>
          ) : null}
        </div>
        <div className={styles.grid}>
          {displayCards.map((c) => (
            <button
              key={`${c.fullName}-${c.id}`}
              type="button"
              className={styles.cardBtn}
              onClick={() => setDetailCard(c)}
            >
              <CardFace
                card={faceDownState ? null : c}
                src={faceDownState ? '' : getScanUrl(c)}
                name={c.name}
                className={styles.cardThumb}
              />
            </button>
          ))}
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            {t('BUTTON_CLOSE')}
          </button>
        </div>
      </div>

      {detailCard ? (
        <CardInfoPopup
          card={detailCard}
          cardList={cardList}
          facedown={faceDownState}
          catalog={catalog}
          getScanUrl={getScanUrl}
          onClose={() => setDetailCard(null)}
          isInGame={isInGame}
          options={options}
          onTableAction={
            onResolve
              ? (action) => {
                  onResolve({ ...action, cardList });
                  onClose();
                }
              : undefined
          }
        />
      ) : null}
    </div>
  );
}
