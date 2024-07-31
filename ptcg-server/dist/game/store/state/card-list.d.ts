import { Card } from '../card/card';
export declare enum StadiumDirection {
    UP = "up",
    DOWN = "down"
}
export declare class CardList {
    cards: Card[];
    isPublic: boolean;
    isSecret: boolean;
    stadiumDirection: StadiumDirection;
    markedAsNotSecret: boolean;
    static fromList(names: string[]): CardList;
    applyOrder(order: number[]): void;
    moveTo(destination: CardList, count?: number): void;
    moveCardsTo(cards: Card[], destination: CardList): void;
    moveCardTo(card: Card, destination: CardList): void;
    top(count?: number): Card[];
    moveToTopOfDestination(destination: CardList): void;
    moveToTop(cards: Card[]): void;
    filter(query: Partial<Card>): Card[];
    count(query: Partial<Card>): number;
}
