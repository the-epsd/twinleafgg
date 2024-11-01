import { CardManager } from '../../cards/card-manager';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Card } from '../card/card';
import { EnergyType, SuperType, TrainerType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { TrainerCard } from '../card/trainer-card';

export enum StadiumDirection {
  UP = 'up',
  DOWN = 'down'
}

export class CardList {

  public cards: Card[] = [];

  public isPublic: boolean = false;

  public isSecret: boolean = false;

  public faceUpPrize: boolean = false;

  public stadiumDirection: StadiumDirection = StadiumDirection.UP;

  public markedAsNotSecret: boolean = false;

  public static fromList(names: string[]): CardList {
    const cardList = new CardList();
    const cardManager = CardManager.getInstance();
    cardList.cards = names.map(cardName => {
      const card = cardManager.getCardByName(cardName);
      if (card === undefined) {
        throw new GameError(GameMessage.UNKNOWN_CARD, cardName);
      }
      return card;
    });
    return cardList;
  }

  public applyOrder(order: number[]) {
    // Check if order is valid, same length
    if (this.cards.length !== order.length) {
      return;
    }
    // Contains all elements exacly one time
    const orderCopy = order.slice();
    orderCopy.sort((a, b) => a - b);
    for (let i = 0; i < orderCopy.length; i++) {
      if (i !== orderCopy[i]) {
        return;
      }
    }
    // Apply order
    const copy = this.cards.slice();
    for (let i = 0; i < order.length; i++) {
      this.cards[i] = copy[order[i]];
    }
  }

  public moveTo(destination: CardList, count?: number): void {
    if (count === undefined) {
      count = this.cards.length;
    }

    count = Math.min(count, this.cards.length);
    const cards = this.cards.splice(0, count);
    destination.cards.push(...cards);
  }

  public moveCardsTo(cards: Card[], destination: CardList): void {
    for (let i = 0; i < cards.length; i++) {
      const index = this.cards.indexOf(cards[i]);
      if (index !== -1) {
        const card = this.cards.splice(index, 1);
        destination.cards.push(card[0]);
      }
    }
  }

  public moveCardTo(card: Card, destination: CardList): void {
    this.moveCardsTo([card], destination);
  }

  public moveToTopOfDestination(destination: CardList): void {
    destination.cards = [...this.cards, ...destination.cards];
  }

  public filter(query: Partial<Card>): Card[] {
    return this.cards.filter(c => {
      for (const key in query) {
        if (Object.prototype.hasOwnProperty.call(query, key)) {
          const value: any = (c as any)[key];
          const expected: any = (query as any)[key];
          if (value !== expected) {
            return false;
          }
        }
      }
      return true;
    });
  }

  public count(query: Partial<Card>): number {
    return this.filter(query).length;
  }
  
  public sort(superType: SuperType = SuperType.POKEMON) {
    this.cards.sort((a, b) => {
      
      const result = this.compareSupertype(a.superType) - this.compareSupertype(b.superType);

      // not of the same supertype
      if (result !== 0) {
        return result;
      }

      // cards match supertype, so sort by subtype
      if ((<any>a).trainerType != null) {
        const cardA = a as TrainerCard;
        if (cardA.trainerType != null && (<any>b).trainerType != null) {
          const cardB = b as TrainerCard;
          const subtypeCompare = this.compareTrainerType(cardA.trainerType) - this.compareTrainerType(cardB.trainerType);
          if (subtypeCompare !== 0) {
            return subtypeCompare;
          }
        }
      }
      else if ((<any>a).energyType != null) {
        const cardA = a as EnergyCard;
        if (cardA.energyType != null && (<any>b).energyType != null) {
          const cardB = b as TrainerCard;
          const subtypeCompare = this.compareEnergyType(cardA.energyType) - this.compareEnergyType(cardB.energyType!);
          if (subtypeCompare !== 0) {
            return subtypeCompare;
          }
        }
      }
      
      // subtype matches, sort by name
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }
  
  private compareSupertype(input: SuperType) {
    if (input === SuperType.POKEMON) return 1;
    if (input === SuperType.TRAINER) return 2;
    if (input === SuperType.ENERGY) return 3;
    return Infinity;
  };
  
  private compareTrainerType(input: TrainerType) {
    if (input === TrainerType.SUPPORTER) return 1;
    if (input === TrainerType.ITEM) return 2;
    if (input === TrainerType.TOOL) return 3;
    if (input === TrainerType.STADIUM) return 4;
    return Infinity;
  };
  
  private compareEnergyType (input: EnergyType) {
    if (input === EnergyType.BASIC) return 1;
    if (input === EnergyType.SPECIAL) return 2;
    return Infinity;
  }
}
