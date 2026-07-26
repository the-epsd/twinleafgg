import type { Card } from 'ptcg-server';
import { arrayMove } from '@dnd-kit/sortable';

export type OrderCardItem = {
  card: Card;
  originalIndex: number;
};

export function orderCardSortableId(originalIndex: number): string {
  return `order-card-${originalIndex}`;
}

export function parseOrderCardSortableId(id: string): number | null {
  const m = /^order-card-(\d+)$/.exec(id);
  return m ? parseInt(m[1], 10) : null;
}

export function buildOrderCardItems(cards: Card[]): OrderCardItem[] {
  return cards.map((card, originalIndex) => ({ card, originalIndex }));
}

export function buildOrderCardsResolvePayload(items: OrderCardItem[]): number[] {
  return items.map((item) => item.originalIndex);
}

export function reorderOrderCardItems(
  items: OrderCardItem[],
  activeId: string,
  overId: string,
): OrderCardItem[] {
  const activeIndex = items.findIndex(
    (item) => orderCardSortableId(item.originalIndex) === activeId,
  );
  const overIndex = items.findIndex(
    (item) => orderCardSortableId(item.originalIndex) === overId,
  );
  if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
    return items;
  }
  return arrayMove(items, activeIndex, overIndex);
}
