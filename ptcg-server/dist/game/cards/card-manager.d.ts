import { Card } from '../store/card/card';
export declare class CardManager {
    private static instance;
    private cards;
    static getInstance(): CardManager;
    defineSet(cards: Card[]): void;
    defineCard(card: Card): void;
    getCardByName(name: string): Card | undefined;
    isCardDefined(name: string): boolean;
    getAllCards(): Card[];
}
