import { Card } from '../store/card/card';
import { CardsInfo } from '../../backend/interfaces/cards.interface';
export declare class CardManager {
    private static instance;
    private cards;
    private cardIndex;
    static getInstance(): CardManager;
    /**
     * Validates all sets for duplicate fullName and legacyFullName without loading.
     * Returns an array of error messages (one per duplicate). Empty if no issues.
     */
    static validateAllSets(entries: Array<{
        key: string;
        cards: Card[];
    }>): string[];
    defineSet(set: Card[]): void;
    loadCardsInfo(cardsInfo: CardsInfo): void;
    defineCard(card: Card): void;
    getCardByName(name: string): Card | undefined;
    isCardDefined(name: string): boolean;
    getAllCards(): Card[];
}
