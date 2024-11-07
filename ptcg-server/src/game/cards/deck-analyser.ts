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
    const countMap: { [name: string]: number } = {};
    const prismStarCards = new Set<string>();
    let hasBasicPokemon = false;
    let hasAceSpec = false;
    let hasRadiant = false;

    if (this.cards.length !== 60) {
      return false;
    }

    // Check for invalid Professor/Boss combinations
    const cardSet = new Set(this.cards.map(c => c.name));
    if ((cardSet.has('Professor Sycamore') && cardSet.has('Professor Juniper')) ||
      (cardSet.has('Professor Juniper') && cardSet.has('Professor\'s Research')) ||
      (cardSet.has('Professor Sycamore') && cardSet.has('Professor\'s Research')) ||
      (cardSet.has('Lysandre') && cardSet.has('Boss\'s Orders'))) {
      return false;
    }

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if (card instanceof PokemonCard && card.stage === Stage.BASIC) {
        hasBasicPokemon = true;
      }

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

      if (card.tags.includes(CardTag.PRISM_STAR)) {
        if (prismStarCards.has(card.name)) {
          return false;
        }
        prismStarCards.add(card.name);
      }
    }

    return hasBasicPokemon;
  }


  public getDeckType(): CardType[] {
    const cardTypes: CardType[] = [];

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      let cardType = CardType.NONE;

      if (card instanceof PokemonCard) {
        cardType = card.cardType;
        if (cardType !== CardType.NONE && cardTypes.indexOf(cardType) === -1) {
          cardTypes.push(cardType);
        }
      }
    }
    return cardTypes;
  }
}


