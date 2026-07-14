import { useDraggable } from '@dnd-kit/core';
import type { Card, CardList } from 'ptcg-server';
import { CardFace } from '../../components/cards/CardFace';
import { publicAssetUrl } from '../../utils/publicAssetUrl';
import { cn } from '../../utils/cn';
import { board2dHandDragId } from './board2dDropIds';
import styles from './Board2DHand.module.css';

export type Board2DHandProps = {
  cards: Card[];
  cardList?: CardList | null;
  opponent?: boolean;
  faceDown?: boolean;
  interactive?: boolean;
  playableCardIds?: ReadonlySet<number> | number[];
  selectedHandIndexes?: ReadonlySet<number>;
  selectableHandIndexes?: ReadonlySet<number>;
  scanUrl: (card: Card, list?: CardList | null) => string;
  onCardClick?: (card: Card, index: number) => void;
  dense?: boolean;
  handTag?: 'bottom' | 'top';
};

function HandCard({
  card,
  index,
  src,
  interactive,
  playable,
  selected,
  selectable,
  dense,
  faceDown,
  onClick,
}: {
  card: Card;
  index: number;
  src: string;
  interactive: boolean;
  playable: boolean;
  selected: boolean;
  selectable: boolean;
  dense: boolean;
  faceDown: boolean;
  onClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: board2dHandDragId(index),
    disabled: !interactive || faceDown,
    data: { type: 'hand', index, card },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        styles.cardWrap,
        dense && styles.dense,
        playable && styles.playable,
        selected && styles.selected,
        selectable && styles.selectable,
        isDragging && styles.dragging,
      )}
      style={dense && index > 0 ? { marginLeft: -18 } : undefined}
      data-hand-index={index}
      onClick={onClick}
      {...(interactive ? { ...listeners, ...attributes } : {})}
    >
      {faceDown ? (
        <img
          className={styles.face}
          src={publicAssetUrl('assets/cardback.png')}
          alt="Card back"
          draggable={false}
        />
      ) : (
        <CardFace className={styles.face} src={src} card={card} name={card.name} draggable={false} />
      )}
    </div>
  );
}

export function Board2DHand({
  cards,
  cardList,
  opponent = false,
  faceDown = false,
  interactive = false,
  playableCardIds,
  selectedHandIndexes,
  selectableHandIndexes,
  scanUrl,
  onCardClick,
  dense,
  handTag,
}: Board2DHandProps) {
  const playableSet =
    playableCardIds instanceof Set
      ? playableCardIds
      : new Set(playableCardIds ?? []);
  const useDense = dense ?? cards.length > 10;

  return (
    <div
      className={cn(styles.hand, opponent && styles.opponent)}
      data-board2d-hand={handTag}
    >
      <div className={styles.scroller}>
        <div className={styles.track}>
          {cards.map((card, index) => (
            <HandCard
              key={`${card.id}-${index}`}
              card={card}
              index={index}
              src={scanUrl(card, cardList)}
              interactive={interactive}
              playable={!faceDown && playableSet.has(card.id)}
              selected={!!selectedHandIndexes?.has(index)}
              selectable={!!selectableHandIndexes?.has(index)}
              dense={useDense}
              faceDown={faceDown}
              onClick={() => onCardClick?.(card, index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
