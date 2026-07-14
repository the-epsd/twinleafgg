import { Card, CardTag } from 'ptcg-server';

export const SHARED_STADIUM_MESH_ID = 'shared_stadium';
export const SHARED_STADIUM_LEFT_MESH_ID = 'shared_stadium_left';
export const SHARED_STADIUM_RIGHT_MESH_ID = 'shared_stadium_right';

export const SHARED_STADIUM_MESH_IDS = [
  SHARED_STADIUM_MESH_ID,
  SHARED_STADIUM_LEFT_MESH_ID,
  SHARED_STADIUM_RIGHT_MESH_ID,
] as const;

export function isSharedStadiumMeshId(cardId: string | undefined | null): boolean {
  return !!cardId && (
    cardId === SHARED_STADIUM_MESH_ID ||
    cardId === SHARED_STADIUM_LEFT_MESH_ID ||
    cardId === SHARED_STADIUM_RIGHT_MESH_ID
  );
}

export function isDualStadiumHalf(card: Card | undefined | null): boolean {
  if (!card) {
    return false;
  }
  if (card.tags?.includes(CardTag.DUAL_STADIUM)) {
    return true;
  }
  return (card.name === 'Legendary Summit' || card.name === 'Legendary Ocean Trench') && card.set === 'M6';
}

/** Left/right stadium halves sorted by set number (left = lower number). */
export function resolveDualStadiumDisplayHalves(cardsInZone: Card[]): [Card, Card] | null {
  if (!cardsInZone?.length) {
    return null;
  }

  const anchor = cardsInZone.find(isDualStadiumHalf);
  if (!anchor) {
    return null;
  }

  const inZone = cardsInZone.filter(c => c.name === anchor.name && isDualStadiumHalf(c));
  const bySetNumber = new Map<string, Card>();
  for (const half of inZone) {
    if (!bySetNumber.has(half.setNumber)) {
      bySetNumber.set(half.setNumber, half);
    }
  }

  const sortedInZone = [...bySetNumber.values()].sort(
    (a, b) => Number(a.setNumber ?? 0) - Number(b.setNumber ?? 0),
  );

  if (sortedInZone.length >= 2) {
    return [sortedInZone[0], sortedInZone[1]];
  }

  return null;
}
