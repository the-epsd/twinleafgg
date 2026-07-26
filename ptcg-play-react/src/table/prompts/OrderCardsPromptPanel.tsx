import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TFunction } from 'i18next';
import type { Card, OrderCardsPrompt } from 'ptcg-server';
import { CardFace } from '../../components/cards/CardFace';
import { ShellButton } from '../../components/ui/ShellButton';
import { cn } from '../../utils/cn';
import {
  buildOrderCardItems,
  buildOrderCardsResolvePayload,
  orderCardSortableId,
  reorderOrderCardItems,
  type OrderCardItem,
} from './orderCardsPromptModel';
import moveStyles from './MoveEnergyPromptPanel.module.css';
import styles from './OrderCardsPromptPanel.module.css';

const s = { ...moveStyles, ...styles };

function SortableOrderCard(props: {
  item: OrderCardItem;
  getScanUrl: (card: Card) => string;
}) {
  const { item, getScanUrl } = props;
  const id = orderCardSortableId(item.originalIndex);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(s.cardSlot, isDragging && s.cardSlotDragging)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <CardFace card={item.card} src={getScanUrl(item.card)} name={item.card.name} />
    </div>
  );
}

export type OrderCardsPromptPanelProps = {
  prompt: OrderCardsPrompt;
  getScanUrl: (card: Card) => string;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
};

export function OrderCardsPromptPanel(props: OrderCardsPromptPanelProps) {
  const { prompt, getScanUrl, t, gameMessageText, resolve } = props;
  const { allowCancel } = prompt.options;

  const initialItemsRef = useRef<OrderCardItem[]>([]);
  const [items, setItems] = useState<OrderCardItem[]>([]);
  const [overlayItem, setOverlayItem] = useState<OrderCardItem | null>(null);

  useEffect(() => {
    const built = buildOrderCardItems(prompt.cards.cards);
    initialItemsRef.current = built;
    setItems(built);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prompt identity
  }, [prompt.id]);

  const sortableIds = useMemo(
    () => items.map((item) => orderCardSortableId(item.originalIndex)),
    [items],
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      const idx = parseInt(String(event.active.id).replace('order-card-', ''), 10);
      const item = items.find((i) => i.originalIndex === idx);
      setOverlayItem(item ?? null);
    },
    [items],
  );

  const onDragEnd = useCallback((event: DragEndEvent) => {
    setOverlayItem(null);
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    setItems((prev) => reorderOrderCardItems(prev, String(active.id), String(over.id)));
  }, []);

  const onDragCancel = useCallback(() => {
    setOverlayItem(null);
  }, []);

  const reset = useCallback(() => {
    setItems(initialItemsRef.current.map((item) => ({ ...item })));
  }, []);

  const onConfirm = useCallback(() => {
    resolve(prompt.id, buildOrderCardsResolvePayload(items));
  }, [items, prompt.id, resolve]);

  const title = t('PROMPT_ORDER_CARDS_TITLE', { defaultValue: 'Order cards' });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className={s.backdrop} role="presentation">
        <div className={s.panel} role="dialog" aria-modal="true">
          <div className={s.promptTitle}>
            <h2 className={s.title}>{title}</h2>
          </div>

          <div className={s.promptContent}>
            <p className={s.message}>{gameMessageText(t, prompt.message)}</p>

            <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
              <div className={s.cardRow}>
                {items.map((item) => (
                  <SortableOrderCard
                    key={orderCardSortableId(item.originalIndex)}
                    item={item}
                    getScanUrl={getScanUrl}
                  />
                ))}
              </div>
            </SortableContext>
          </div>

          <div className={s.promptActions}>
            <ShellButton type="button" variant="secondary" onClick={reset}>
              {t('PROMPT_RESET', { defaultValue: 'Reset' })}
            </ShellButton>
            <div className={s.actionsGrow} aria-hidden />
            {allowCancel ? (
              <ShellButton type="button" variant="secondary" onClick={() => resolve(prompt.id, null)}>
                {t('BUTTON_CANCEL')}
              </ShellButton>
            ) : null}
            <ShellButton type="button" variant="secondary" onClick={onConfirm}>
              {t('BUTTON_OK')}
            </ShellButton>
          </div>
        </div>
      </div>

      <DragOverlay zIndex={2000} dropAnimation={null}>
        {overlayItem ? (
          <div className={cn(s.cardSlot, s.cardPrompt)}>
            <CardFace
              card={overlayItem.card}
              src={getScanUrl(overlayItem.card)}
              name={overlayItem.card.name}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
