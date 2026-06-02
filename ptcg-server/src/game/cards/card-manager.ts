import { Card } from '../store/card/card';
import { deepClone } from '../../utils/utils';
import { CardsInfo } from '../../backend/interfaces/cards.interface';

export class CardManager {

  private static instance: CardManager;
  private cards: Card[] = [];
  private cardIndex: { [name: string]: number } = {};
  private printIdCounts: { [name: string]: number } = {};

  public static getInstance(): CardManager {
    if (!CardManager.instance) {
      CardManager.instance = new CardManager();
    }
    return CardManager.instance;
  }

  /**
   * Validates all sets for duplicate lookup names without loading.
   * Returns an array of error messages (one per duplicate). Empty if no issues.
   */
  public static validateAllSets(
    entries: Array<{ key: string; cards: Card[] }>
  ): string[] {
    const manager = new CardManager();
    const errors: string[] = [];

    for (const { key, cards } of entries) {
      try {
        if (Array.isArray(cards)) {
          manager.defineSet(cards);
        }
      } catch (error) {
        errors.push(`${key}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return errors;
  }

  public defineSet(set: Card[]): void {
    for (const card of set) {
      const index = this.cards.length;
      this.assignPrintId(card);
      this.defineCardLookups(card, index);
      this.cards.push(card);
    }
  }

  public loadCardsInfo(cardsInfo: CardsInfo) {
    this.cardIndex = {};
    this.printIdCounts = {};
    this.cards = cardsInfo.cards;
    for (let i = 0; i < this.cards.length; i++) {
      this.assignPrintId(this.cards[i]);
      this.defineCardLookups(this.cards[i], i);
    }
  }

  public defineCard(card: Card): void {
    const index = this.cards.length;
    this.assignPrintId(card);
    this.defineCardLookups(card, index);
    this.cards.push(card);
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

  public static getPrintId(card: Card): string {
    return (card.printId || CardManager.buildPrintId(card)).trim();
  }

  private static buildPrintId(card: Card): string {
    const name = (card.name || '').trim();
    const set = (card.set || '').trim();
    const setNumber = (card.setNumber || '').trim();

    if (name && set && setNumber) {
      return `${name} ${set} ${setNumber}`;
    }

    return (card.fullName || '').trim();
  }

  public static getLookupNames(card: Card): string[] {
    const printId = CardManager.getPrintId(card);
    card.printId = printId;

    const names = [
      printId,
      card.fullName,
      card.legacyFullName,
      ...(card.legacyFullNames || []),
      ...(card.aliases || [])
    ];

    return Array.from(new Set(names.map(name => (name || '').trim()).filter(Boolean)));
  }

  private defineCardLookups(card: Card, index: number): void {
    for (const name of CardManager.getLookupNames(card)) {
      const existingIndex = this.cardIndex[name];
      if (existingIndex !== undefined && this.cards[existingIndex] !== card) {
        if (name === card.printId) {
          throw new Error('Multiple cards with the same print id: ' + name);
        }
        continue;
      }
      this.cardIndex[name] = index;
    }
  }

  private assignPrintId(card: Card): void {
    const basePrintId = CardManager.buildPrintId(card);
    const count = (this.printIdCounts[basePrintId] || 0) + 1;
    this.printIdCounts[basePrintId] = count;
    card.printId = count === 1 ? basePrintId : `${basePrintId}#${count}`;
  }

}
