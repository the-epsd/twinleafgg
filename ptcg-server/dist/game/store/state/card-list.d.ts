import { Card } from '../card/card';
export declare class CardList {
    cards: Card[];
    isPublic: boolean;
    isSecret: boolean;
    static fromList(names: string[]): CardList;
    applyOrder(order: number[]): void;
    moveTo(destination: CardList, count?: number): void;
    moveCardsTo(cards: Card[], destination: CardList): void;
    moveCardTo(card: Card, destination: CardList): void;
    top(count?: number): Card[];
    moveToTop(cards: Card[]): void;
    filter(query: Partial<Card>): Card[];
    count(query: Partial<Card>): number;
}
