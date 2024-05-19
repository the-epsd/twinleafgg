import { Card } from '../store/card/card';
import { CardManager } from './card-manager';
import { EnergyCard } from '../store/card/energy-card';
import { EnergyType, Stage, CardType, CardTag } from '../store/card/card-types';
import { PokemonCard } from '../store/card/pokemon-card';

export class DeckAnalyser {

  private cards: Card[];

  constructor(public cardNames: string[] = []) {
    const cardManager = CardManager.getInstance();
    this.cards = [];

    cardNames.forEach(name => {
      const card = cardManager.getCardByName(name);
      if (card !== undefined) {
        this.cards.push(card);
      }
    });
  }

  public isValid(): boolean {
    const countMap: { [name: string]: number } = { };
    let hasBasicPokemon = false;
    let hasAceSpec = false;
    let hasRadiant = false;

    if (this.cards.length !== 60) {
      return false;
    }

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      // Check if deck has a basic Pokemon card
      if (card instanceof PokemonCard && card.stage === Stage.BASIC) {
        hasBasicPokemon = true;
      }

      // Count cards, except basic energies
      if (!(card instanceof EnergyCard) || card.energyType !== EnergyType.BASIC) {
        countMap[card.name] = (countMap[card.name] || 0) + 1;
        if (countMap[card.name] > 4) {
          return false;
        }
      }

      if (card.tags.includes(CardTag.ACE_SPEC)) {
        if (hasAceSpec) {
          return false;
        }
        hasAceSpec = true;
      }
      if (card.tags.includes(CardTag.RADIANT)) {
        if (hasRadiant) {
          return false;
        }
        hasRadiant = true;
      }
    }

    return hasBasicPokemon;
  }

  public getDeckType(): CardType[] {
    const cardTypes: CardType[] = [];

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      let cardTypez = CardType.NONE;

      if (card instanceof PokemonCard) {
        cardTypez = card.cardTypez;
        if (cardTypez !== CardType.NONE && cardTypes.indexOf(cardTypez) === -1) {
          cardTypes.push(cardTypez);
        }
      }
    }
    return cardTypes;
  }
}


