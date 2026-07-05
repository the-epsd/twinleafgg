import { Card } from '../card/card';
import { CardTag, CardType, EnergyType, Stage } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';

type DeckCounts = {
  counts: Map<string, number>;
  tagCounts: Map<string, number>;
  typeCounts: Map<CardType, number>;
  prismStarCounts: Map<string, number>;
  pokemonCount: number;
  basicCount: number;
  basicUnownCount: number;
};

function defaultValue(value: number | undefined): number {
  return value !== undefined ? value : 0;
}

export function COUNT_CARDS_IN_DECK(deck: Card[]): DeckCounts {
  let deckCounts = {
    counts: new Map(),
    tagCounts: new Map(),
    typeCounts: new Map(),
    prismStarCounts: new Map(),
    pokemonCount: 0,
    basicCount: 0,
    basicUnownCount: 0,
  };

  for (let card of deck) {
    if (card.energyType != EnergyType.BASIC) {
      // Count number of cards with each unique name. Handle Prism Stars separately since their max count is pre-set
      if (card.tags.includes(CardTag.PRISM_STAR))
        deckCounts.prismStarCounts.set(
          card.name,
          defaultValue(deckCounts.prismStarCounts.get(card.name)) + 1,
        );
      else deckCounts.counts.set(card.name, defaultValue(deckCounts.counts.get(card.name)) + 1);

      // Tag count
      for (let tag of card.tags) {
        deckCounts.tagCounts.set(tag, defaultValue(deckCounts.tagCounts.get(tag)) + 1);
      }

      // Pokémon-specific counts
      if (card instanceof PokemonCard) {
        deckCounts.pokemonCount++;

        // Count number of Pokémon types
        deckCounts.typeCounts.set(
          card.cardType,
          defaultValue(deckCounts.typeCounts.get(card.cardType)) + 1,
        );
        if (card.additionalCardTypes != undefined) {
          for (let additionalType of card.additionalCardTypes) {
            deckCounts.typeCounts.set(
              additionalType,
              defaultValue(deckCounts.typeCounts.get(additionalType)) + 1,
            );
          }
        }

        // Basic count
        if (card.stage == Stage.BASIC) deckCounts.basicCount++;

        // Basic Unown count (for Neo Unown check)
        if (card.name.includes('Unown') && card.stage == Stage.BASIC) deckCounts.basicUnownCount++;
      }
    }
  }

  return deckCounts;
}

export function AT_LEAST_ONE_BASIC(deckCounts: DeckCounts): boolean {
  return deckCounts.basicCount >= 1;
}

export function CHECK_MAX_COUNTS(deckCounts: DeckCounts, maxCopies: number = 4): boolean {
  var isLegal = true;

  // Neo Unown check -- if any Neo-era Unown are in the deck, all Basics with Unown get counted together
  const hasNeoUnown = defaultValue(deckCounts.tagCounts.get(CardTag.UNOWN)) >= 1;
  isLegal &&= !(hasNeoUnown || deckCounts.basicUnownCount > 4);

  // Platinum Arceus check -- if any Arceus AR are in the deck, don't check Arceus
  const hasPlatinumArceus = defaultValue(deckCounts.tagCounts.get(CardTag.ARCEUS)) >= 1;

  // Check that each named non-Basic Energy card has an allowed number of cards.
  // Except Arceus, if Platinum Arceus are in the deck.
  for (let [cardName, count] of deckCounts.counts) {
    isLegal &&= (cardName == 'Arceus' && hasPlatinumArceus) || count <= maxCopies;
  }

  // Check that each Prism Star card doesn't have more than 1 copy
  for (let [_, count] of deckCounts.prismStarCounts) isLegal &&= count <= 1;

  // ACE SPEC, Radiant check
  isLegal &&= defaultValue(deckCounts.tagCounts.get(CardTag.ACE_SPEC)) <= 1;
  isLegal &&= defaultValue(deckCounts.tagCounts.get(CardTag.RADIANT)) <= 1;

  return isLegal;
}

// /**
//  * Returns `true` if every Pokémon in this deck shares a type, `false` otherwise
//  * @param deck a list of `Card`s.
//  */
// export function IS_MONOTYPE(deckCounts: DeckCounts): boolean {
//   // TODO: implement
//   return true
// }

// /**
//  * Returns `true` if every Pokémon in this deck does not have a Rule Box, `false` otherwise
//  * @param deck a list of `Card`s.
//  */
// export function NO_RULE_BOXES(deckCounts: DeckCounts): boolean {
//   var noRuleBoxes = true;

//   for (let card of deck) {
//     noRuleBoxes &&= card.hasRuleBox();
//   }

//   return noRuleBoxes;
// }

// /**
//  * Returns `true` if every Pokémon in this deck gives up just 1 Prize card, `false` otherwise
//  * @param deck a list of `Card`s.
//  */
// export function NO_MULTI_PRIZERS(deckCounts: DeckCounts): boolean {
//
// }

// /**
//  * Returns `true` if no Pokémon in this deck has any of the specified tags, `false` otherwise
//  * @param deck a list of `Card`s.
//  */
// export function NO_CARDS_WITH_TAGS(deckCounts: DeckCounts, tags: string[]): boolean {
//
// }

// /**
//  * Returns `true` if every Pokémon in this deck is the specified type, `false` otherwise
//  * @param deck a list of `Card`s.
//  */
// export function ALL_POKEMON_SPECIFIC_TYPE(deckCounts: DeckCounts, type: CardType): boolean {
//
// }
