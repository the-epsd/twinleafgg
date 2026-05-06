import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Card } from 'ptcg-server';
import { SuperType } from 'ptcg-server';
import { CardFace } from '../components/cards';
import { isFavoriteCard, toggleFavoriteCard } from './favoriteCardsStorage';
import styles from './CardSwapDialog.module.css';

function IconSwapHoriz({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
    </svg>
  );
}

function IconHeart({ filled, size = 18 }: { filled: boolean; size?: number }) {
  return filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 18.24 4 15.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 6.89-3.14 9.74-7.9 13.05z" />
    </svg>
  );
}

function isPokemonCard(card: Card): boolean {
  return card.superType === SuperType.POKEMON;
}

export type CardSwapDialogProps = {
  open: boolean;
  onClose: () => void;
  currentCard: Card;
  alternativeCards: Card[];
  getScanUrl: (card: Card) => string;
  onSelect: (card: Card) => void;
};

export function CardSwapDialog({
  open,
  onClose,
  currentCard,
  alternativeCards,
  getScanUrl,
  onSelect,
}: CardSwapDialogProps) {
  const { t } = useTranslation();
  const [, setFavTick] = useState(0);
  const bumpFav = useCallback(() => setFavTick((t) => t + 1), []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const toggleFav = (card: Card, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteCard(card);
    bumpFav();
  };

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-swap-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="card-swap-title" className={styles.title}>
          {t('SWAP_CARD_TITLE')}
        </h2>
        <div className={styles.content}>
          <div className={styles.cardsContainer}>
            <div className={styles.currentCardItem}>
              <div className={styles.cardLabel}>{t('CARD_CURRENT')}</div>
              <div className={styles.cardWrapper}>
                <div className={styles.swapCardLarge}>
                  <CardFace
                    card={currentCard}
                    src={getScanUrl(currentCard)}
                    name={currentCard.name}
                    loading="lazy"
                    style={{ width: '100%' }}
                  />
                </div>
                {!isPokemonCard(currentCard) && (
                  <button
                    type="button"
                    className={styles.favoriteIconButton}
                    title={isFavoriteCard(currentCard) ? t('FAVORITE_REMOVE') : t('FAVORITE_ADD')}
                    onClick={(e) => toggleFav(currentCard, e)}
                  >
                    <IconHeart filled={isFavoriteCard(currentCard)} />
                  </button>
                )}
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.setInfo}>
                  {currentCard.set} {currentCard.setNumber}
                </span>
              </div>
            </div>

            {alternativeCards.length > 0 ? (
              <div className={styles.alternativesSection}>
                <div className={styles.cardsRow}>
                  {alternativeCards.map((card) => (
                    <div key={card.fullName} className={styles.cardItem} onClick={() => onSelect(card)}>
                      <div className={styles.cardWrapper}>
                        <div className={styles.swapCardSmall}>
                          <CardFace card={card} src={getScanUrl(card)} name={card.name} loading="lazy" style={{ width: '100%' }} />
                        </div>
                        <button
                          type="button"
                          className={styles.swapIconButton}
                          title={t('SWAP_PRINTING')}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(card);
                          }}
                        >
                          <IconSwapHoriz size={24} />
                        </button>
                        {!isPokemonCard(card) && (
                          <button
                            type="button"
                            className={`${styles.favoriteIconButton} ${styles.favoriteIconButtonSmall}`}
                            title={isFavoriteCard(card) ? t('FAVORITE_REMOVE') : t('FAVORITE_ADD')}
                            onClick={(e) => toggleFav(card, e)}
                          >
                            <IconHeart filled={isFavoriteCard(card)} size={16} />
                          </button>
                        )}
                      </div>
                      <div className={styles.cardInfo}>
                        <span className={styles.setInfo}>
                          {card.set} {card.setNumber}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.noAlternatives}>
                <p>{t('NO_ALTERNATIVES')}</p>
              </div>
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            {t('BUTTON_CANCEL')}
          </button>
        </div>
      </div>
    </div>
  );
}
