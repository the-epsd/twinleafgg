import { Card } from '../store/card/card';
import { deepClone } from '../../utils/utils';
import { CardsInfo } from '../../backend/interfaces/cards.interface';

export class CardManager {

  private static instance: CardManager;
  private cards: Card[] = [];
  private cardIndex: { [name: string]: number } = {};

  public static getInstance(): CardManager {
    if (!CardManager.instance) {
      CardManager.instance = new CardManager();
    }
    return CardManager.instance;
  }

  public defineSet(set: Card[]): void {
    for (const card of set) {
      if (this.cardIndex[card.fullName] !== undefined) {
        throw new Error('Multiple cards with the same name: ' + card.fullName);
      }

      const index = this.cards.length;
      this.cards.push(card);
      this.cardIndex[card.fullName] = index;

      const p = card as any;
      if (p.legacyFullName) {
        if (this.cardIndex[p.legacyFullName] !== undefined) {
          throw new Error('Multiple cards with the same name: ' + p.legacyFullName);
        }
        this.cardIndex[p.legacyFullName] = index;
      }
    }
  }

  public loadCardsInfo(cardsInfo: CardsInfo) {
    this.cardIndex = {};
    this.cards = cardsInfo.cards;
    for (let i = 0; i < this.cards.length; i++) {
      this.cardIndex[this.cards[i].fullName] = i;
    }
  }

  public defineCard(card: Card): void {
    if (this.cardIndex[card.fullName] !== undefined) {
      throw new Error('Multiple cards with the same name: ' + card.fullName);
    }

    const index = this.cards.length;
    this.cards.push(card);
    this.cardIndex[card.fullName] = index;
  }

  public getCardByName(name: string): Card | undefined {
    const index = this.cardIndex[name];
    if (index !== undefined) {
      return deepClone(this.cards[index]);
    }
  }

  public isCardDefined(name: string): boolean {
    return this.cardIndex[name] !== undefined;
  }

  public getAllCards(): Card[] {
    return this.cards;
  }

}
