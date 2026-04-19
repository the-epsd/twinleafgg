import type { AttachEnergyOptions, Card, CardTarget, EnergyCard } from 'ptcg-server';
import { CardList, CardType, PokemonCardList, SuperType } from 'ptcg-server';
import type { FilterType } from 'ptcg-server';
import { mapPokemonItems, type PokemonItem, type PokemonRow } from './pokemonPromptRows';
import { targetsEqual } from './removeDamagePromptModel';

export type AttachAssignment = {
  to: CardTarget;
  originalIndex: number;
  card: Card;
};

export function buildAttachEnergyFilterMap(
  cards: Card[],
  filter: FilterType,
  blocked: number[],
): Record<string, boolean> {
  const filterMap: Record<string, boolean> = {};
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    let isBlocked = blocked.includes(i);
    if (!isBlocked) {
      for (const key in filter) {
        if (Object.prototype.hasOwnProperty.call(filter, key)) {
          isBlocked =
            isBlocked ||
            (filter as Record<string, unknown>)[key] !== (card as unknown as Record<string, unknown>)[key];
        }
      }
    }
    filterMap[card.fullName] = !isBlocked;
  }
  return filterMap;
}

export function isEnergyIndexEligible(filterMap: Record<string, boolean>, card: Card): boolean {
  return filterMap[card.fullName] === true;
}

export function matchesBlockedToTarget(target: CardTarget, blockedTo: CardTarget[]): boolean {
  return blockedTo.some((b) => targetsEqual(b, target));
}

export function wouldViolateSameTarget(
  assignments: Pick<AttachAssignment, 'to'>[],
  to: CardTarget,
  sameTarget: boolean,
): boolean {
  if (!sameTarget || assignments.length === 0) {
    return false;
  }
  return !assignments.every((a) => targetsEqual(a.to, to));
}

export function wouldViolateDifferentTargets(
  assignments: Pick<AttachAssignment, 'to'>[],
  to: CardTarget,
  differentTargets: boolean,
): boolean {
  if (!differentTargets) {
    return false;
  }
  return assignments.some((a) => targetsEqual(a.to, to));
}

/** Deep snapshot of Pokémon rows for reset (detach nested card/energy arrays). */
export function snapshotPokemonRows(rows: PokemonRow[]): PokemonRow[] {
  return rows.map((row) => ({
    ...row,
    items: row.items.map((item) => ({
      ...item,
      target: { ...item.target },
      selected: false,
      cardList: snapshotPokemonCardList(item.cardList),
    })),
  }));
}

function snapshotPokemonCardList(source: PokemonCardList): PokemonCardList {
  const p = Object.assign(new PokemonCardList(), source);
  p.cards = [...source.cards];
  p.energies = Object.assign(new CardList(), source.energies);
  p.energies.cards = [...source.energies.cards];
  return p;
}

export function attachEnergyToRows(rows: PokemonRow[], target: CardTarget, card: Card): PokemonRow[] {
  return mapPokemonItems(rows, (item) => {
    if (!targetsEqual(item.target, target)) {
      return item;
    }
    if (!(item.cardList instanceof PokemonCardList)) {
      return item;
    }
    const newList = Object.assign(new PokemonCardList(), item.cardList);
    newList.cards = [...item.cardList.cards];
    newList.energies = Object.assign(new CardList(), item.cardList.energies);
    newList.energies.cards = [...item.cardList.energies.cards, card];
    if (!newList.cards.includes(card)) {
      newList.cards.push(card);
    }
    return { ...item, cardList: newList };
  });
}

function getAssignCardType(card: Card): number {
  if (card.superType === SuperType.ENERGY) {
    const energyCard = card as EnergyCard;
    return energyCard.provides.length > 0 ? energyCard.provides[0] : CardType.NONE;
  }
  return CardType.NONE;
}

/** true = confirm should be disabled (invalid). */
export function computeAttachEnergyInvalid(assignments: AttachAssignment[], options: AttachEnergyOptions): boolean {
  if (assignments.length < options.min || assignments.length > options.max) {
    return true;
  }

  if (options.validCardTypes && options.validCardTypes.length > 0) {
    for (const a of assignments) {
      const ec = a.card as EnergyCard;
      if (ec.provides?.every((p) => !options.validCardTypes!.includes(p))) {
        return true;
      }
    }
  }

  if (options.differentTypes) {
    const seen: Record<number, boolean> = {};
    for (const a of assignments) {
      const ty = getAssignCardType(a.card);
      if (seen[ty]) {
        return true;
      }
      seen[ty] = true;
    }
  }

  if (options.maxPerType) {
    const typeCounts = new Map<CardType, number>();
    for (const a of assignments) {
      const ec = a.card as EnergyCard;
      const type = ec.provides[0];
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
      if (typeCounts.get(type)! > options.maxPerType) {
        return true;
      }
    }
  }

  return false;
}

export function canAcceptDrop(
  item: PokemonItem,
  assignments: AttachAssignment[],
  options: AttachEnergyOptions,
): boolean {
  if (matchesBlockedToTarget(item.target, options.blockedTo ?? [])) {
    return false;
  }
  if (item.cardList.cards.length === 0) {
    return false;
  }
  if (assignments.length >= options.max) {
    return false;
  }
  return true;
}

export function tryAssignDrop(
  item: PokemonItem,
  assignments: AttachAssignment[],
  options: AttachEnergyOptions,
): boolean {
  if (!canAcceptDrop(item, assignments, options)) {
    return false;
  }
  if (wouldViolateSameTarget(assignments, item.target, options.sameTarget)) {
    return false;
  }
  if (wouldViolateDifferentTargets(assignments, item.target, options.differentTargets)) {
    return false;
  }
  return true;
}
