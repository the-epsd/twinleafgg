import type { Card, EnergyCard, PokemonCard, TrainerCard } from 'ptcg-server';
import { CardType, Format, SuperType } from 'ptcg-server';
import { FormatValidator } from './formatValidator';
import type { DeckEditToolbarFilter } from './types';

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

const SearchMatchTier = {
  EXACT_NAME: 0,
  NAME_CONTAINS: 1,
  IDENTIFIER: 2,
  TEXT: 3,
  NO_MATCH: 4,
} as const;

type SearchMatchTier = (typeof SearchMatchTier)[keyof typeof SearchMatchTier];

function searchCleanse(value: string): string {
  return value.toLocaleLowerCase().replace(/é/g, 'e').replace(/'/g, '');
}

function getIdentifierSearchFields(card: Card): string[] {
  const cardName = searchCleanse(card.name);
  const set = searchCleanse(card.set);
  return [
    cardName,
    searchCleanse(card.fullName),
    set,
    searchCleanse(card.setNumber),
    `${cardName} ${set}`,
  ];
}

function getTextSearchFields(card: Card): string[] {
  const fields: string[] = [];

  const trainerCard = card as TrainerCard;
  if (trainerCard.text !== undefined) {
    fields.push(searchCleanse(trainerCard.text));
  }

  const energyCard = card as EnergyCard;
  if (energyCard.text !== undefined) {
    fields.push(searchCleanse(energyCard.text));
  }

  for (const attack of card.attacks) {
    fields.push(searchCleanse(attack.name));
    fields.push(searchCleanse(attack.text));
  }

  for (const power of card.powers) {
    fields.push(searchCleanse(power.name));
    fields.push(searchCleanse(power.text));
  }

  return fields;
}

function getAllSearchFields(card: Card): string[] {
  return [...getIdentifierSearchFields(card), ...getTextSearchFields(card)];
}

function tokensMatchFields(fields: string[], tokens: string[]): boolean {
  return tokens.every((token) => fields.some((field) => field.includes(token)));
}

function cardTextFieldsMatch(card: Card, search: string): boolean {
  return getTextSearchFields(card).some((field) => field.includes(search));
}

function countNameTokenMatches(card: Card, tokens: string[]): number {
  const cardName = searchCleanse(card.name);
  return tokens.filter((token) => cardName.includes(token)).length;
}

function getSearchMatchTier(card: Card, searchValue: string): SearchMatchTier {
  const search = searchCleanse(searchValue.trim());
  if (!search) {
    return SearchMatchTier.NO_MATCH;
  }

  const cardName = searchCleanse(card.name);
  const fullName = searchCleanse(card.fullName);
  const setNumber = searchCleanse(card.setNumber);
  const set = searchCleanse(card.set);
  const nameAndSet = `${cardName} ${set}`;

  if (cardName === search) {
    return SearchMatchTier.EXACT_NAME;
  }

  if (cardName.includes(search)) {
    return SearchMatchTier.NAME_CONTAINS;
  }

  const tokens = search.split(/\s+/).filter(Boolean);
  const identifierFields = getIdentifierSearchFields(card);
  const allFields = getAllSearchFields(card);

  if (
    fullName.includes(search) ||
    setNumber.includes(search) ||
    set.includes(search) ||
    nameAndSet.includes(search) ||
    (tokens.length > 1 && tokensMatchFields(identifierFields, tokens))
  ) {
    return SearchMatchTier.IDENTIFIER;
  }

  if (tokens.length > 1 && tokensMatchFields(allFields, tokens)) {
    if (countNameTokenMatches(card, tokens) > 0) {
      return SearchMatchTier.NAME_CONTAINS;
    }
    return SearchMatchTier.TEXT;
  }

  if (cardTextFieldsMatch(card, search)) {
    return SearchMatchTier.TEXT;
  }

  return SearchMatchTier.NO_MATCH;
}

function matchCardText(card: Card, searchValue: string): boolean {
  return getSearchMatchTier(card, searchValue) !== SearchMatchTier.NO_MATCH;
}

/** Lower = better match. Secondary sort is applied by `sortFilteredLibrary`. */
export function compareSearchRelevance(a: Card, b: Card, searchValue: string): number {
  const tierA = getSearchMatchTier(a, searchValue);
  const tierB = getSearchMatchTier(b, searchValue);
  if (tierA !== tierB) {
    return tierA - tierB;
  }

  if (tierA === SearchMatchTier.NAME_CONTAINS) {
    const search = searchCleanse(searchValue.trim());
    const tokens = search.split(/\s+/).filter(Boolean);
    if (tokens.length > 1) {
      const nameMatchesB = countNameTokenMatches(b, tokens) - countNameTokenMatches(a, tokens);
      if (nameMatchesB !== 0) {
        return nameMatchesB;
      }
    }

    const lenDiff = searchCleanse(a.name).length - searchCleanse(b.name).length;
    if (lenDiff !== 0) {
      return lenDiff;
    }
  }

  return 0;
}

export function sortFilteredLibrary(cards: Card[], filter: DeckEditToolbarFilter): Card[] {
  const search = filter.searchValue?.trim();

  if (!search && !filter.selectedSet) {
    return sortLibraryCatalog(cards);
  }

  return cards.slice().sort((a, b) => {
    if (search) {
      const relevance = compareSearchRelevance(a, b, search);
      if (relevance !== 0) {
        return relevance;
      }
    }

    if (filter.selectedSet) {
      return sortLibraryBySetNumber(a, b);
    }

    return compareLibraryCards(a, b);
  });
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
  return sortFilteredLibrary(filtered, filter);
}
