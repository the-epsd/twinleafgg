import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Card, CardList, Player } from 'ptcg-server';
import type { CardInfoPaneOptions, CardInfoTableAction } from './CardInfoPane';
import { CardInfoPane } from './CardInfoPane';
import { CardInfoImageColumn } from './CardInfoImageColumn';
import paneStyles from './CardInfoPane.module.css';
import styles from './CardInfoPopup.module.css';

export type CardInfoPopupProps = {
  card: Card;
  /** When set (in-game Pokémon), HP reflects list damage and HP modifiers. */
  cardList?: CardList;
  players?: Player[];
  facedown?: boolean;
  catalog: Card[];
  getScanUrl: (card: Card) => string;
  onClose: () => void;
  onCardSwap?: (event: { originalCard: Card; replacementCard: Card }) => void;
  /** Deck builder: not in game — swap + favorites match Angular out-of-table behavior. */
  isInGame?: boolean;
  options?: CardInfoPaneOptions;
  showTags?: boolean;
  cardTextKerning?: number;
  /** When set (in-game), ability/attack/trainer clicks invoke this then typically close. Return false to keep open. */
  onTableAction?: (action: CardInfoTableAction) => void | boolean;
};

export function CardInfoPopup({
  card,
  cardList,
  players,
  facedown = false,
  catalog,
  getScanUrl,
  onClose,
  onCardSwap,
  isInGame = false,
  options,
  showTags,
  cardTextKerning,
  onTableAction,
}: CardInfoPopupProps) {
  const { t } = useTranslation();
  const [swapOpen, setSwapOpen] = useState(false);
  useEffect(() => {
    setSwapOpen(false);
  }, [card.fullName]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-info-dialog-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="card-info-dialog-title" className={styles.title}>
          {facedown ? t('CARDS_UNKNOWN') : ''}
        </h2>
        <div className={styles.content}>
          <div className={paneStyles.pane}>
            <CardInfoImageColumn
              key={`img-${card.fullName}`}
              card={card}
              catalog={catalog}
              facedown={facedown}
              getScanUrl={getScanUrl}
              isInGame={isInGame}
              onSwapClick={() => setSwapOpen(true)}
            />
            <CardInfoPane
              key={card.fullName}
              card={card}
              cardList={cardList}
              players={players}
              facedown={facedown}
              catalog={catalog}
              getScanUrl={getScanUrl}
              isInGame={isInGame}
              options={options}
              showTags={showTags}
              cardTextKerning={cardTextKerning}
              onCardSwap={onCardSwap}
              onTableAction={
                onTableAction
                  ? (action) => {
                      const shouldClose = onTableAction(action);
                      if (shouldClose !== false) {
                        onClose();
                      }
                    }
                  : undefined
              }
              omitScanColumn
              swapOpen={swapOpen}
              onSwapOpenChange={setSwapOpen}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <span className={styles.spacer} />
          <button type="button" className={styles.closeBtn} onClick={() => onClose()}>
            {t('BUTTON_CLOSE')}
          </button>
        </div>
      </div>
    </div>
  );
}
