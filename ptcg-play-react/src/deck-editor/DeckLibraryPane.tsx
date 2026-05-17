import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '../i18n/strings';
import type { CSSProperties } from 'react';
import type { Card } from 'ptcg-server';
import { CardType, SuperType } from 'ptcg-server';
import type { PokemonCard } from 'ptcg-server';
import { CardFace } from '../components/cards';
import { DECK_CARD_AR, DECK_CARD_GAP_PX } from './deckCardLayout';
import headerStyles from './DeckPaneHeader.module.css';
import styles from './DeckLibraryPane.module.css';

const NEAR_END_PX = 400;
const SCROLL_PAD_X = 12;
const GAP = DECK_CARD_GAP_PX;

function typeBadgeColor(card: Card): string | null {
  if (card.superType !== SuperType.POKEMON) {
    return null;
  }
  const t = (card as PokemonCard).cardType;
  const map: Partial<Record<CardType, string>> = {
    [CardType.GRASS]: '#4caf50',
    [CardType.FIRE]: '#ff7043',
    [CardType.WATER]: '#42a5f5',
    [CardType.LIGHTNING]: '#ffee58',
    [CardType.PSYCHIC]: '#ab47bc',
    [CardType.FIGHTING]: '#8d6e63',
    [CardType.DARK]: '#5c6bc0',
    [CardType.METAL]: '#90a4ae',
    [CardType.COLORLESS]: '#e0e0e0',
    [CardType.DRAGON]: '#9575cd',
    [CardType.FAIRY]: '#f48fb1',
  };
  return map[t] ?? '#78909c';
}

function LibraryCardThumb({
  card,
  slotW,
  scanUrl,
  showTypeBadge,
  disabled,
  inDeckCount,
  canAddMore,
  onAdd,
  onRemoveOne,
  onOpenInfo,
}: {
  card: Card;
  slotW: number;
  scanUrl: string;
  showTypeBadge: boolean;
  disabled: boolean;
  inDeckCount: number;
  canAddMore: boolean;
  onAdd: () => void;
  onRemoveOne: () => void;
  onOpenInfo: () => void;
}) {
  const { t } = useTranslation();

  const badge = showTypeBadge ? typeBadgeColor(card) : null;
  const thumbStyle = {
    width: slotW,
    ['--deck-slot-w' as string]: `${slotW}px`,
  } as CSSProperties;
  const inDeck = inDeckCount > 0;

  return (
    <div className={styles.thumb} style={thumbStyle}>
      <div className={styles.cardFace} onClick={() => onOpenInfo()}>
        <CardFace
          card={card}
          src={scanUrl}
          name={card.name}
          loading="lazy"
          draggable={false}
          shadow={inDeck ? 'deckInDeck' : 'none'}
          style={{ width: '100%', ['--deck-slot-w' as string]: `${slotW}px` }}
        >
          {inDeck ? (
            <button
              type="button"
              className={styles.countCircle}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
              }}
              aria-label={t('LIBRARY_IN_DECK_ARIA', { count: inDeckCount })}
            >
              {inDeckCount}
            </button>
          ) : null}
          {inDeck ? (
            <button
              type="button"
              className={`${styles.circleBtn} ${styles.circleBtnRemove}`}
              disabled={disabled}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveOne();
              }}
              aria-label={t('LIBRARY_REMOVE_ONE_DECK')}
            >
              <svg className={styles.circleBtnIcon} viewBox="0 0 24 24" aria-hidden>
                <path d="M19 13H5v-2h14v2z" fill="currentColor" />
              </svg>
            </button>
          ) : null}
          <button
            type="button"
            className={`${styles.circleBtn} ${styles.circleBtnAdd}`}
            disabled={disabled || !canAddMore}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            aria-label={t('LIBRARY_ADD_ONE_DECK')}
          >
            <svg className={styles.circleBtnIcon} viewBox="0 0 24 24" aria-hidden>
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
            </svg>
          </button>
        </CardFace>
      </div>
      {badge && <span className={styles.typeBadge} style={{ background: badge }} title={t('LIBRARY_TYPE_TITLE')} />}
    </div>
  );
}

export type DeckLibraryPaneProps = {
  /** Match deck pane card width (px). */
  cardSlotW: number;
  cards: Card[];
  scanComplete: boolean;
  onNearCatalogEnd?: () => void;
  getScanUrl: (card: Card) => string;
  showTypeBadge: boolean;
  disabled: boolean;
  onAddCard: (card: Card) => void;
  onRemoveOneFromDeck: (fullName: string) => void;
  /** Copies in deck for this printing (`fullName` → count). */
  inDeckCounts: ReadonlyMap<string, number>;
  canAddCard: (card: Card) => boolean;
  onOpenCardInfo: (card: Card) => void;
};

export function DeckLibraryPane({
  cardSlotW,
  cards,
  scanComplete,
  onNearCatalogEnd,
  getScanUrl,
  showTypeBadge,
  disabled,
  onAddCard,
  onRemoveOneFromDeck,
  inDeckCounts,
  canAddCard,
  onOpenCardInfo,
}: DeckLibraryPaneProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const nearEndRef = useRef(onNearCatalogEnd);
  nearEndRef.current = onNearCatalogEnd;
  const [gridMetrics, setGridMetrics] = useState({ cols: 2, rowPad: 0 });

  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const innerW = Math.max(0, el.clientWidth - SCROLL_PAD_X * 2);
    const slotW = Math.max(44, cardSlotW);
    const cols = Math.max(1, Math.floor((innerW + GAP) / (slotW + GAP)));
    const rowPad = Math.max(0, (innerW - (cols * slotW + (cols - 1) * GAP)) / 2);
    setGridMetrics({ cols, rowPad });
  }, [cardSlotW]);

  useEffect(() => {
    measure();
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    const fn = nearEndRef.current;
    if (!el || !fn || scanComplete) {
      return;
    }
    if (el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_END_PX) {
      fn();
    }
  }, [scanComplete]);

  const { cols, rowPad } = gridMetrics;
  const slotW = Math.max(44, cardSlotW);
  const rowHeight = slotW * DECK_CARD_AR + GAP;
  const rows = useMemo(() => Math.ceil(cards.length / cols) || 1, [cards.length, cols]);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual
  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 4,
  });

  /* Clear cached row heights when layout changes. Do not encode slotW in getItemKey — that remounts every row on each resize tick and reloads images (flash of CardFace background). */
  useLayoutEffect(() => {
    rowVirtualizer.measure();
  }, [rowVirtualizer, rowHeight, cols, rows]);

  return (
    <div className={styles.wrap}>
      <div className={headerStyles.header}>
        <span className={headerStyles.title}>{t('LIBRARY_TITLE_WITH_COUNT', { count: cards.length })}</span>
        <div className={headerStyles.aside}>
          {!scanComplete ? <span className={headerStyles.status}>{t('PROTECTED_LOADING')}</span> : null}
        </div>
      </div>
      <div ref={scrollRef} className={styles.scroll} onScroll={onScroll}>
        {cards.length === 0 ? (
          <div className={styles.empty}>{t('LIBRARY_NO_MATCH_FILTERS')}</div>
        ) : (
          <div
            className={styles.gridInner}
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((vRow) => {
              const rowIndex = vRow.index;
              const startIdx = rowIndex * cols;
              const rowCards = cards.slice(startIdx, startIdx + cols);
              return (
                <div
                  key={vRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${vRow.size}px`,
                    transform: `translateY(${vRow.start}px)`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: GAP,
                    paddingLeft: rowPad,
                    paddingRight: rowPad,
                    boxSizing: 'border-box',
                  }}
                >
                  {rowCards.map((card) => (
                    <LibraryCardThumb
                      key={card.fullName}
                      card={card}
                      slotW={slotW}
                      scanUrl={getScanUrl(card)}
                      showTypeBadge={showTypeBadge}
                      disabled={disabled}
                      inDeckCount={inDeckCounts.get(card.fullName) ?? 0}
                      canAddMore={canAddCard(card)}
                      onAdd={() => onAddCard(card)}
                      onRemoveOne={() => onRemoveOneFromDeck(card.fullName)}
                      onOpenInfo={() => onOpenCardInfo(card)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
