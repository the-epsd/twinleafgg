import { Card, CardTag } from 'ptcg-server';

export function isDualStadiumHalf(card: Card | undefined | null): boolean {
  if (!card) {
    return false;
  }
  if (card.tags?.includes(CardTag.DUAL_STADIUM)) {
    return true;
  }
  return card.name === 'Legendary Summit' && card.set === 'M6';
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
