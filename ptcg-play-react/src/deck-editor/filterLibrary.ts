import type { Card, EnergyCard, PokemonCard, TrainerCard } from 'ptcg-server';
import { CardType, Format, SuperType } from 'ptcg-server';

/** Same ordering as Angular `CardsBaseService.compareCards` (deck library catalog). */
export function compareLibraryCards(c1: Card, c2: Card): number {
  if (c1.superType !== c2.superType) {
    return c1.superType - c2.superType;
  }
  switch (c1.superType) {
    case SuperType.POKEMON: {
      const p1 = c1 as PokemonCard;
      const p2 = c2 as PokemonCard;
      if (p1.cardType !== p2.cardType) {
        return p1.cardType - p2.cardType;
      }
      break;
    }
    case SuperType.ENERGY: {
      const e1 = c1 as EnergyCard;
      const e2 = c2 as EnergyCard;
      if (e1.energyType !== e2.energyType) {
        return e1.energyType - e2.energyType;
      }
      const type1 = e1.provides.length > 0 ? e1.provides[0] : CardType.NONE;
      const type2 = e2.provides.length > 0 ? e2.provides[0] : CardType.NONE;
      if (type1 !== type2) {
        return type1 - type2;
      }
      break;
    }
    case SuperType.TRAINER: {
      const t1 = c1 as TrainerCard;
      const t2 = c2 as TrainerCard;
      if (t1.trainerType !== t2.trainerType) {
        return t1.trainerType - t2.trainerType;
      }
      break;
    }
    default:
      break;
  }
  return c1.fullName < c2.fullName ? -1 : c1.fullName > c2.fullName ? 1 : 0;
}

export function sortLibraryCatalog(cards: Card[]): Card[] {
  return cards.length <= 1 ? cards.slice() : cards.slice().sort(compareLibraryCards);
}
import { FormatValidator } from './formatValidator';
import type { DeckEditToolbarFilter } from './types';

function searchCleanse(value: string): string {
  return value.toLocaleLowerCase().replace('é', 'e');
}

function matchCardText(card: Card, searchValue: string): boolean {
  const search = searchCleanse(searchValue);
  const cardName = searchCleanse(card.name);
  const setNumber = searchCleanse(card.setNumber);
  const set = searchCleanse(card.set);

  if (cardName.includes(search) || setNumber.includes(search) || set.includes(search)) {
    return true;
  }

  const trainerCard = card as TrainerCard;
  if (trainerCard.text !== undefined) {
    const trainerText = searchCleanse(trainerCard.text);
    if (trainerText.includes(search)) {
      return true;
    }
  }

  const energyCard = card as EnergyCard;
  if (energyCard.text !== undefined) {
    const energyText = searchCleanse(energyCard.text);
    if (energyText.includes(search)) {
      return true;
    }
  }

  if (card.attacks.length > 0) {
    const attackNames = card.attacks.map((attack) => searchCleanse(attack.name));
    const attackTexts = card.attacks.map((attack) => searchCleanse(attack.text));
    if (attackNames.some((n) => n.includes(search)) || attackTexts.some((n) => n.includes(search))) {
      return true;
    }
  }
  if (card.powers.length > 0) {
    const powerNames = card.powers.map((power) => searchCleanse(power.name));
    const powerTexts = card.powers.map((power) => searchCleanse(power.text));
    if (powerNames.some((n) => n.includes(search)) || powerTexts.some((n) => n.includes(search))) {
      return true;
    }
  }
  return false;
}

function matchRetreatCosts(retreatCosts: number[], card: Card): boolean {
  const pokemonCard = card as PokemonCard;
  if (pokemonCard.retreat === undefined) {
    return false;
  }
  if (retreatCosts.includes(0) && !card.retreat.length) {
    return true;
  }
  return retreatCosts.includes(card.retreat.length);
}

function matchAttackCosts(attackCosts: number[], card: Card): boolean {
  const pokemonCard = card as PokemonCard;
  if (pokemonCard.attacks === undefined) {
    return false;
  }
  const attacks = pokemonCard.attacks;
  if (attackCosts.includes(0) && attacks.map((a) => a.cost.length).filter((c) => c === 0).length >= 1) {
    return true;
  }
  return attackCosts.some((c) => attacks.map((a) => a.cost.length).includes(c));
}

function getCardType(card: Card): CardType {
  if (card.superType === SuperType.POKEMON) {
    return (card as PokemonCard).cardType;
  }
  if (card.superType === SuperType.ENERGY) {
    const energyCard = card as EnergyCard;
    if (energyCard.provides.length > 0) {
      return energyCard.provides[0];
    }
  }
  return CardType.NONE;
}

function getFormats(card: Card): Format[] {
  return FormatValidator.getValidFormats(card);
}

export function isDeckLibraryFilterEmpty(filter: DeckEditToolbarFilter): boolean {
  return (
    !filter.searchValue?.trim() &&
    !filter.selectedSet &&
    filter.superTypes.length === 0 &&
    filter.stages.length === 0 &&
    filter.cardTypes.length === 0 &&
    filter.energyTypes.length === 0 &&
    filter.trainerTypes.length === 0 &&
    filter.tags.length === 0 &&
    filter.attackCosts.length === 0 &&
    filter.retreatCosts.length === 0 &&
    filter.formats.length === 0
  );
}

/** Same predicate as `filterLibraryCards` for a single card (when the toolbar filter is not empty). */
export function matchesDeckLibraryFilter(card: Card, filter: DeckEditToolbarFilter): boolean {
  if (filter.selectedSet && card.set !== filter.selectedSet) {
    return false;
  }

  if (filter.searchValue?.trim() && !matchCardText(card, filter.searchValue.trim())) {
    return false;
  }

  if (filter.superTypes.length && !filter.superTypes.includes(card.superType)) {
    return false;
  }

  if (filter.stages.length && !filter.stages.includes((card as PokemonCard).stage)) {
    return false;
  }

  if (filter.energyTypes.length && !filter.energyTypes.includes((card as EnergyCard).energyType)) {
    return false;
  }

  if (filter.trainerTypes.length && !filter.trainerTypes.includes((card as TrainerCard).trainerType)) {
    return false;
  }

  if (filter.retreatCosts.length && !matchRetreatCosts(filter.retreatCosts, card)) {
    return false;
  }

  if (filter.attackCosts.length && !matchAttackCosts(filter.attackCosts, card)) {
    return false;
  }

  if (
    filter.cardTypes.length &&
    !filter.cardTypes.includes(getCardType(card)) &&
    !filter.cardTypes.includes(CardType.ANY)
  ) {
    return false;
  }

  if (filter.tags.length && !filter.tags.some((tag) => card.tags.includes(tag))) {
    return false;
  }

  if (filter.formats.length && !filter.formats.some((f) => getFormats(card).includes(f))) {
    return false;
  }

  return true;
}

function sortLibraryBySetNumber(a: Card, b: Card): number {
  const sa = a.setNumber ?? '';
  const sb = b.setNumber ?? '';
  const byNum = sa.localeCompare(sb, undefined, { numeric: true, sensitivity: 'base' });
  if (byNum !== 0) {
    return byNum;
  }
  return a.fullName.localeCompare(b.fullName);
}

/** Filter full card catalog for the library (Angular `filterCards` pipe). */
export function filterLibraryCards(cards: Card[], filter: DeckEditToolbarFilter): Card[] {
  if (isDeckLibraryFilterEmpty(filter)) {
    return sortLibraryCatalog(cards);
  }

  const filtered = cards.filter((card) => matchesDeckLibraryFilter(card, filter));

  if (!filter.selectedSet) {
    return sortLibraryCatalog(filtered);
  }

  return filtered.slice().sort(sortLibraryBySetNumber);
}
