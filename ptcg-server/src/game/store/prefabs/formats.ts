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

function compareArrayContents(array: Array<any>, other: Array<any>) {
  return array.length == other.length && array.sort().toString() == other.sort().toString();
}

export function CARD_TEXT_IDENTICAL(card: PokemonCard, other: PokemonCard): boolean {
  var isIdentical = true;

  isIdentical &&= card.name == other.name;
  isIdentical &&= card.stage == other.stage;
  isIdentical &&= card.evolvesFrom == other.evolvesFrom;
  isIdentical &&= card.cardType == other.cardType;

  // Weakness
  isIdentical &&= card.weakness.length == other.weakness.length;
  if (isIdentical) {
    for (var i in card.weakness) {
      isIdentical &&= card.weakness[i].type == other.weakness[i].type;
      isIdentical &&= card.weakness[i].value == other.weakness[i].value;
    }
  }

  // Resistance
  isIdentical &&= card.resistance.length == other.resistance.length;
  if (isIdentical) {
    for (var i in card.resistance) {
      isIdentical &&= card.resistance[i].type == other.resistance[i].type;
      isIdentical &&= card.resistance[i].value == other.resistance[i].value;
    }
  }

  isIdentical &&= compareArrayContents(card.retreat, other.retreat);

  // Card tags
  isIdentical &&= compareArrayContents(card.cardTag, other.cardTag);

  // Powers
  isIdentical &&= card.powers.length == other.powers.length;
  if (isIdentical) {
    for (var i in card.powers) {
      isIdentical &&= card.powers[i].name == other.powers[i].name;
      isIdentical &&= card.powers[i].powerType == other.powers[i].powerType;
      isIdentical &&= card.powers[i].text == other.powers[i].text;
    }
  }

  // Attacks
  isIdentical &&= card.attacks.length == other.attacks.length;
  if (isIdentical) {
    for (var i in card.attacks) {
      isIdentical &&= card.attacks[i].name == other.attacks[i].name;
      isIdentical &&= card.attacks[i].damage == other.attacks[i].damage;
      isIdentical &&= card.attacks[i].damageCalculation == other.attacks[i].damageCalculation;
      isIdentical &&= card.attacks[i].text == other.attacks[i].text;
      isIdentical &&= compareArrayContents(card.attacks[i].cost, other.attacks[i].cost);
    }
  }

  // Game effect
  isIdentical &&= card.reduceEffect == other.reduceEffect;

  return isIdentical;
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
          (deckCounts.prismStarCounts.get(card.name) || 0) + 1,
        );
      else deckCounts.counts.set(card.name, (deckCounts.counts.get(card.name) || 0) + 1);

      // Tag count
      for (let tag of card.tags) {
        deckCounts.tagCounts.set(tag, (deckCounts.tagCounts.get(tag) || 0) + 1);
      }

      // Pokémon-specific counts
      if (card instanceof PokemonCard) {
        deckCounts.pokemonCount++;

        // Count number of Pokémon types
        deckCounts.typeCounts.set(
          card.cardType,
          (deckCounts.typeCounts.get(card.cardType) || 0) + 1,
        );
        for (let additionalType of card.additionalCardTypes || []) {
          deckCounts.typeCounts.set(
            additionalType,
            (deckCounts.typeCounts.get(additionalType) || 0) + 1,
          );
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
  const hasNeoUnown = (deckCounts.tagCounts.get(CardTag.UNOWN) || 0) >= 1;
  isLegal &&= !(hasNeoUnown || deckCounts.basicUnownCount > 4);

  // Platinum Arceus check -- if any Arceus AR are in the deck, don't check Arceus
  const hasPlatinumArceus = (deckCounts.tagCounts.get(CardTag.ARCEUS) || 0) >= 1;

  // Check that each named non-Basic Energy card has an allowed number of cards.
  // Except Arceus, if Platinum Arceus are in the deck.
  for (let [cardName, count] of deckCounts.counts) {
    isLegal &&= (cardName == 'Arceus' && hasPlatinumArceus) || count <= maxCopies;
  }

  // Check that each Prism Star card doesn't have more than 1 copy
  for (let [_, count] of deckCounts.prismStarCounts) isLegal &&= count <= 1;

  // ACE SPEC, Radiant check
  isLegal &&= (deckCounts.tagCounts.get(CardTag.ACE_SPEC) || 0) <= 1;
  isLegal &&= (deckCounts.tagCounts.get(CardTag.RADIANT) || 0) <= 1;

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
