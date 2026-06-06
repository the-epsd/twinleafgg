import type { Card, CardTarget, MoveEnergyOptions } from 'ptcg-server';
import { CardList, PokemonCardList } from 'ptcg-server';
import type { FilterType } from 'ptcg-server';
import {
  mapPokemonItems,
  matchesPokemonTarget,
  type PokemonItem,
  type PokemonRow,
} from './pokemonPromptRows';
import { targetsEqual } from './removeDamagePromptModel';

export type MoveEnergyTransfer = {
  from: CardTarget;
  to: CardTarget;
  card: Card;
};

/** Map each card to its original index in `cardList.cards` at prompt open (server decode uses original state). */
export function buildOriginalCardIndexMap(rows: PokemonRow[]): Map<Card, number> {
  const map = new Map<Card, number>();
  for (const row of rows) {
    for (const item of row.items) {
      item.cardList.cards.forEach((card, index) => {
        map.set(card, index);
      });
    }
  }
  return map;
}

/** Resolve blocked cards for one source using `cardList.cards` indices (server convention). */
export function buildBlockedCardsForSource(
  item: PokemonItem,
  blockedMap: { source: CardTarget; blocked: number[] }[],
): Card[] {
  const blockedItem = blockedMap.find((bm) => matchesPokemonTarget(item, [bm.source]));
  if (blockedItem === undefined) {
    return [];
  }
  const cards: Card[] = [];
  blockedItem.blocked.forEach((b) => {
    if (b >= 0 && b < item.cardList.cards.length) {
      cards.push(item.cardList.cards[b]);
    }
  });
  return cards;
}

/** @deprecated Use {@link buildBlockedCardsForSource} per source. Kept for callers that need a flat list. */
export function buildBlockedCardList(
  rows: PokemonRow[],
  blockedMap: { source: CardTarget; blocked: number[] }[],
): Card[] {
  const cards: Card[] = [];
  for (const row of rows) {
    for (const item of row.items) {
      for (const card of buildBlockedCardsForSource(item, blockedMap)) {
        if (!cards.includes(card)) {
          cards.push(card);
        }
      }
    }
  }
  return cards;
}

function matchesFilter(card: Card, filter: FilterType): boolean {
  for (const key in filter) {
    if (Object.prototype.hasOwnProperty.call(filter, key)) {
      if ((filter as Record<string, unknown>)[key] !== (card as unknown as Record<string, unknown>)[key]) {
        return false;
      }
    }
  }
  return true;
}

/** Energy cards on the selected source that may be dragged (filter + blockedMap). */
export function filterEligibleEnergyCards(
  item: PokemonItem,
  filter: FilterType,
  blockedCards: Card[],
): Card[] {
  const energies = item.cardList.energies.cards;
  return energies.filter((card: Card) => !blockedCards.includes(card) && matchesFilter(card, filter));
}

export function moveEnergyBetweenRows(
  rows: PokemonRow[],
  fromTarget: CardTarget,
  toTarget: CardTarget,
  card: Card,
): PokemonRow[] {
  return mapPokemonItems(rows, (item) => {
    if (targetsEqual(item.target, fromTarget)) {
      return { ...item, cardList: removeEnergyFromList(item.cardList, card) };
    }
    if (targetsEqual(item.target, toTarget)) {
      return { ...item, cardList: addEnergyToList(item.cardList, card) };
    }
    return item;
  });
}

function removeEnergyFromList(source: PokemonCardList, card: Card): PokemonCardList {
  const fromPkm = Object.assign(new PokemonCardList(), source);
  fromPkm.cards = [...source.cards];
  fromPkm.energies = Object.assign(new CardList(), source.energies);
  fromPkm.energies.cards = [...source.energies.cards];

  const energyIndex = fromPkm.energies.cards.indexOf(card);
  if (energyIndex !== -1) {
    fromPkm.energies.cards.splice(energyIndex, 1);
    const cardIndex = fromPkm.cards.indexOf(card);
    if (cardIndex !== -1) {
      fromPkm.cards.splice(cardIndex, 1);
    }
  } else {
    const index = fromPkm.cards.indexOf(card);
    if (index !== -1) {
      fromPkm.cards.splice(index, 1);
    }
  }
  return fromPkm;
}

function addEnergyToList(source: PokemonCardList, card: Card): PokemonCardList {
  const toPkm = Object.assign(new PokemonCardList(), source);
  toPkm.cards = [...source.cards];
  toPkm.energies = Object.assign(new CardList(), source.energies);
  toPkm.energies.cards = [...source.energies.cards];

  toPkm.energies.cards.push(card);
  if (!toPkm.cards.includes(card)) {
    toPkm.cards.push(card);
  }
  return toPkm;
}

/** Merge or cancel chained moves for the same energy card (mirrors Angular `appendMoveResult`). */
export function appendMoveResult(
  results: MoveEnergyTransfer[],
  next: MoveEnergyTransfer,
): MoveEnergyTransfer[] {
  const index = results.findIndex((r) => r.card === next.card);
  if (index === -1) {
    return [...results, next];
  }
  const prevResult = results[index];
  if (targetsEqual(prevResult.from, next.to)) {
    return results.filter((_, i) => i !== index);
  }
  const updated = [...results];
  updated[index] = { ...prevResult, to: next.to };
  return updated;
}

/** true = confirm should be disabled (invalid). */
export function computeMoveEnergyInvalid(
  results: MoveEnergyTransfer[],
  options: Pick<MoveEnergyOptions, 'min' | 'max'>,
): boolean {
  if (results.length < options.min) {
    return true;
  }
  if (typeof options.max === 'number' && results.length > options.max) {
    return true;
  }
  return false;
}

export function hasMoveEnergyTransferLimit(max: MoveEnergyOptions['max']): max is number {
  return typeof max === 'number' && Number.isFinite(max);
}

export function buildMoveEnergyResolvePayload(
  results: MoveEnergyTransfer[],
  indexMap: Map<Card, number>,
): { from: CardTarget; to: CardTarget; index: number }[] {
  return results.map((r) => {
    const index = indexMap.get(r.card);
    if (index === undefined) {
      throw new Error('Missing original card index for move energy transfer');
    }
    return { from: r.from, to: r.to, index };
  });
}

export function canSelectSource(item: PokemonItem, blockedFrom: CardTarget[]): boolean {
  if (item.cardList.cards.length === 0) {
    return false;
  }
  return !matchesPokemonTarget(item, blockedFrom);
}

export function canDropOnTarget(
  item: PokemonItem,
  sourceTarget: CardTarget | undefined,
  blockedTo: CardTarget[],
): boolean {
  if (item.cardList.cards.length === 0) {
    return false;
  }
  if (sourceTarget !== undefined && targetsEqual(item.target, sourceTarget)) {
    return false;
  }
  return !matchesPokemonTarget(item, blockedTo);
}
