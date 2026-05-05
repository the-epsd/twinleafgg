import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { Card } from 'ptcg-server';
import { CardFace } from '../components/cards';
import { DECK_CARD_AR, DECK_CARD_GAP_PX, DECK_DEFAULT_SLOT_W, DECK_MAX_SLOT_W } from './deckCardLayout';
import type { DeckSlot } from './types';
import headerStyles from './DeckPaneHeader.module.css';
import styles from './DeckBuildPane.module.css';

const CARD_AR = DECK_CARD_AR;
const DECK_GAP_PX = DECK_CARD_GAP_PX;
const MIN_SLOT_W = 44;

function deckGridFits(slotW: number, slotCount: number, cw: number, ch: number, gap: number): boolean {
  if (slotCount <= 0 || slotW < MIN_SLOT_W) {
    return true;
  }
  const cellH = slotW * CARD_AR;
  const cmax = Math.max(1, Math.floor((cw + gap) / (slotW + gap)));
  const maxRows = Math.max(1, Math.floor((ch + gap) / (cellH + gap)));
  return Math.ceil(slotCount / cmax) <= maxRows;
}

function computeMaxSlotWidth(slotCount: number, cw: number, ch: number, gap: number): number {
  if (slotCount <= 0) {
    return DECK_DEFAULT_SLOT_W;
  }
  let lo = MIN_SLOT_W;
  let hi = Math.min(DECK_MAX_SLOT_W, Math.floor(cw));
  let best = lo;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (deckGridFits(mid, slotCount, cw, ch, gap)) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

function SortableDeckCard({
  slot,
  scanUrl,
  disabled,
  onAddCopy,
  onRemoveCopy,
  onOpenInfo,
}: {
  slot: DeckSlot;
  scanUrl: string;
  disabled: boolean;
  onAddCopy: () => void;
  onRemoveCopy: () => void;
  onOpenInfo: () => void;
}) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slot.card.fullName,
    disabled,
    data: { source: 'deck' as const, card: slot.card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.slot}>
      <div
        className={`${styles.cardWrap} ${isDragging ? styles.cardWrapDragging : ''}`}
        {...attributes}
        {...listeners}
        onClick={() => onOpenInfo()}
      >
        <CardFace card={slot.card} src={scanUrl} name={slot.card.name} loading="lazy" style={{ width: '100%' }}>
          {slot.count > 0 ? (
            <button
              type="button"
              className={styles.countCircle}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
              }}
              aria-label={t('DECK_EDIT_QUANTITY_ARIA', { count: slot.count })}
            >
              {slot.count}
            </button>
          ) : null}
          {slot.count > 0 ? (
            <button
              type="button"
              className={`${styles.circleBtn} ${styles.circleBtnRemove}`}
              disabled={disabled}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveCopy();
              }}
              aria-label={t('DECK_EDIT_REMOVE_ONE')}
            >
              <svg className={styles.circleBtnIcon} viewBox="0 0 24 24" aria-hidden>
                <path d="M19 13H5v-2h14v2z" fill="currentColor" />
              </svg>
            </button>
          ) : null}
          <button
            type="button"
            className={`${styles.circleBtn} ${styles.circleBtnAdd}`}
            disabled={disabled}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onAddCopy();
            }}
            aria-label={t('DECK_EDIT_ADD_ONE')}
          >
            <svg className={styles.circleBtnIcon} viewBox="0 0 24 24" aria-hidden>
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
            </svg>
          </button>
        </CardFace>
      </div>
    </div>
  );
}

export type DeckBuildPaneProps = {
  slots: DeckSlot[];
  getScanUrl: (card: Card) => string;
  disabled: boolean;
  deckCount: number;
  ruleMessage: string | null;
  showLibraryToggle: boolean;
  libraryHidden: boolean;
  onToggleLibrary: () => void;
  onAddCopy: (fullName: string) => void;
  onRemoveCopy: (fullName: string) => void;
  onOpenCardInfo: (card: Card) => void;
  /** Fired when measured deck card width changes (library matches this). */
  onSlotWidthChange?: (slotWidthPx: number) => void;
};

export function DeckBuildPane({
  slots,
  getScanUrl,
  disabled,
  deckCount,
  ruleMessage,
  showLibraryToggle,
  libraryHidden,
  onToggleLibrary,
  onAddCopy,
  onRemoveCopy,
  onOpenCardInfo,
  onSlotWidthChange,
}: DeckBuildPaneProps) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: 'deck-drop' });
  const dropElRef = useRef<HTMLDivElement | null>(null);
  const [slotW, setSlotW] = useState(DECK_DEFAULT_SLOT_W);

  const setDropRef = useCallback(
    (node: HTMLDivElement | null) => {
      dropElRef.current = node;
      setNodeRef(node);
    },
    [setNodeRef],
  );

  const measureDeckFit = useCallback(() => {
    const el = dropElRef.current;
    if (!el || slots.length === 0) {
      setSlotW(DECK_DEFAULT_SLOT_W);
      onSlotWidthChange?.(DECK_DEFAULT_SLOT_W);
      return;
    }
    const padLr = 24;
    const padTb = 12 + 72;
    const cw = Math.max(0, el.clientWidth - padLr);
    const ch = Math.max(0, el.clientHeight - padTb);
    // Tabbed layout hides the deck with display:none; size is 0×0 and would collapse slot width
    // to MIN_SLOT_W and shrink the library grid. Keep the last measured width until the deck is visible.
    if (cw < 48 || ch < 48) {
      return;
    }
    const next = computeMaxSlotWidth(slots.length, cw, ch, DECK_GAP_PX);
    setSlotW(next);
    onSlotWidthChange?.(next);
  }, [slots.length, onSlotWidthChange]);

  useLayoutEffect(() => {
    const el = dropElRef.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver(() => {
      measureDeckFit();
    });
    ro.observe(el);
    const id = requestAnimationFrame(() => {
      measureDeckFit();
    });
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [measureDeckFit]);

  const ids = slots.map((s) => s.card.fullName);

  const gridStyle = {
    '--deck-slot-w': `${slotW}px`,
    '--deck-gap': `${DECK_GAP_PX}px`,
  } as CSSProperties;

  return (
    <div className={styles.wrap}>
      <div className={headerStyles.header}>
        <span className={headerStyles.title}>{t('DECK_EDIT_YOUR_DECK_COUNT', { count: deckCount })}</span>
        <div className={headerStyles.aside}>
          {showLibraryToggle ? (
            <button type="button" className={headerStyles.actionBtn} onClick={onToggleLibrary}>
              {libraryHidden ? t('DECK_EDIT_SHOW_LIBRARY') : t('DECK_EDIT_HIDE_LIBRARY')}
            </button>
          ) : null}
        </div>
      </div>
      <div
        ref={setDropRef}
        className={styles.dropZone}
        style={{
          outline: isOver ? '2px solid rgba(0, 0, 0, 0.25)' : undefined,
          outlineOffset: -2,
        }}
      >
        {slots.length === 0 ? (
          <div className={styles.emptyDrop}>{t('DECK_BUILD_DROP_HINT')}</div>
        ) : (
          <SortableContext items={ids} strategy={rectSortingStrategy}>
            <div className={styles.grid} style={gridStyle}>
              {slots.map((slot) => (
                <SortableDeckCard
                  key={slot.card.fullName}
                  slot={slot}
                  scanUrl={getScanUrl(slot.card)}
                  disabled={disabled}
                  onAddCopy={() => onAddCopy(slot.card.fullName)}
                  onRemoveCopy={() => onRemoveCopy(slot.card.fullName)}
                  onOpenInfo={() => onOpenCardInfo(slot.card)}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
      {ruleMessage && (
        <div className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.toast}>{ruleMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}
