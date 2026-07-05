import { Card } from '../card/card';
import { Stage } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { AT_LEAST_ONE_BASIC, COUNT_CARDS_IN_DECK } from '../prefabs/formats';
import { Erratum, GameplayRule } from './format-types';

type CardNameAndSet = { name: string; set: string; setNumber: string };

export abstract class Format {
  public abstract name: string; // Display name, e.g. "2010 Worlds"
  public shortName: string = ''; // Use for set span identifiers where appropriate, e.g. "DP-UL"
  public abstract fullName: string; // Database identifier. Do not change these!

  public deckSize = 60;
  public numPrizeCards = 6;

  public gameplayRules: GameplayRule[] = [
    GameplayRule.T1_FIRST_NO_ATTACK,
    GameplayRule.T1_FIRST_NO_SUPPORTER,
  ];

  public errata: Erratum[] = [Erratum.TOOLS_ARE_NOT_ITEMS];
}

/**
 * A format where players build their own decks according to certain rules.
 */
export abstract class ConstructedFormat extends Format {
  /**
   * Returns `true` if the provided card is legal in this format, `false` otherwise.
   * @param card The card to check
   */
  public abstract isCardLegal(card: Card): boolean;

  /**
   * Returns `true` if the provided list of cards is a legal deck in this format, `false` otherwise.
   * @param deck
   */
  public isDeckLegal(deck: Card[]): boolean {
    // null is not legal
    if (!deck) return false;

    var isLegal = true;

    // Deck size check
    isLegal &&= deck.length == this.deckSize;

    // Card legality check
    for (let card of deck) {
      isLegal &&= this.isCardLegal(card);
    }

    return isLegal;
  }

  banlist: CardNameAndSet[] = []; // For convenience's sake

  /**
   * Check if the provided card is on the banlist for this format.
   * The banlist is list of objects in the format { name: string; set: string; setNumber: string }.
   * Use `"*"` as a wildcard for either set or set number.
   * @param card The card to check
   * @returns `true` if the card is on the banlist, `false` otherwise
   */
  public isCardOnBanlist(card: Card): boolean {
    for (var bannedCard of this.banlist) {
      if (
        card.name == bannedCard.name && // No wildcards for card name. If you want to disallow an entire set, change the legality rules in isDeckLegal.
        (bannedCard.set == '*' || card.set == bannedCard.set) &&
        (bannedCard.setNumber == '*' || card.setNumber == bannedCard.setNumber)
      )
        return true;
    }

    return false;
  }
}
