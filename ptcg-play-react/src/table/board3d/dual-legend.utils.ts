import { Card, CardTag, Player, PlayerType, SlotType, type CardTarget } from 'ptcg-server';

export function isDualLegendHalf(card: Card | undefined | null): boolean {
  if (!card) {
    return false;
  }
  return !!card.tags?.includes(CardTag.DUAL_LEGEND);
}

/** Both distinct halves of the same dual LEGEND must be in hand. */
export function getDualLegendHalvesInHand(handCards: readonly Card[], card: Card): Card[] {
  const halves = handCards.filter(
    c => c.name === card.name && c.tags?.includes(CardTag.DUAL_LEGEND),
  );
  const bySetNumber = new Map<string, Card>();
  for (const half of halves) {
    if (!bySetNumber.has(half.setNumber)) {
      bySetNumber.set(half.setNumber, half);
    }
  }
  return [...bySetNumber.values()].sort(
    (a, b) => Number(a.setNumber ?? 0) - Number(b.setNumber ?? 0),
  );
}

export function hasBothDualLegendHalvesInHand(handCards: readonly Card[], card: Card): boolean {
  return getDualLegendHalvesInHand(handCards, card).length >= 2;
}

export function cardCanAssembleLegendFromHand(
  card: Card | undefined | null,
  handCards: readonly Card[] | undefined | null,
): boolean {
  if (!card || !handCards?.length) {
    return false;
  }
  return isDualLegendHalf(card) && hasBothDualLegendHalvesInHand(handCards, card);
}

/** True when two hand cards are distinct halves of the same dual LEGEND. */
export function isMatchingLegendHalf(first: Card, second: Card): boolean {
  if (!isDualLegendHalf(first) || !isDualLegendHalf(second)) {
    return false;
  }
  if (first.name !== second.name || first.id === second.id) {
    return false;
  }
  return first.setNumber !== second.setNumber;
}

export function findLegendAssemblyPartnerHandIndex(
  handCards: readonly Card[],
  selectedHandIndex: number,
): number | null {
  const first = handCards[selectedHandIndex];
  if (!first) {
    return null;
  }
  for (let i = 0; i < handCards.length; i++) {
    if (i !== selectedHandIndex && isMatchingLegendHalf(first, handCards[i])) {
      return i;
    }
  }
  return null;
}

export function resolveLegendAssemblyBenchTarget(player: Player): CardTarget | null {
  const emptyBench = player.bench?.findIndex((b) => (b?.cards?.length ?? 0) === 0) ?? -1;
  if (emptyBench < 0) {
    return null;
  }
  return {
    player: PlayerType.BOTTOM_PLAYER,
    slot: SlotType.BENCH,
    index: emptyBench,
  };
}

/** Map play + partner hand indices to top/bottom LEGEND halves. */
export function resolveLegendAssemblyHalfHandIndices(
  handCards: readonly Card[],
  playHandIndex: number,
  partnerHandIndex: number,
): { topIndex: number; bottomIndex: number } | null {
  const playCard = handCards[playHandIndex];
  const partnerCard = handCards[partnerHandIndex];
  if (!playCard || !partnerCard || !isMatchingLegendHalf(playCard, partnerCard)) {
    return null;
  }

  const playIsTop = playCard.fullName.includes('(Top)');
  const partnerIsTop = partnerCard.fullName.includes('(Top)');
  if (playIsTop && !partnerIsTop) {
    return { topIndex: playHandIndex, bottomIndex: partnerHandIndex };
  }
  if (partnerIsTop && !playIsTop) {
    return { topIndex: partnerHandIndex, bottomIndex: playHandIndex };
  }

  const halves = getDualLegendHalvesInHand(handCards, playCard);
  if (halves.length < 2) {
    return null;
  }
  const topIndex = handCards.indexOf(halves[0]);
  const bottomIndex = handCards.indexOf(halves[1]);
  if (topIndex < 0 || bottomIndex < 0) {
    return null;
  }
  return { topIndex, bottomIndex };
}
