import { Card } from '../card/card';
import { SuperType } from '../card/card-types';
export declare enum StadiumDirection {
    UP = "up",
    DOWN = "down"
}
export declare class CardList {
    cards: Card[];
    isPublic: boolean;
    isSecret: boolean;
    faceUpPrize: boolean;
    stadiumDirection: StadiumDirection;
    markedAsNotSecret: boolean;
    static fromList(names: string[]): CardList;
    applyOrder(order: number[]): void;
    moveTo(destination: CardList, count?: number): void;
    moveCardsTo(cards: Card[], destination: CardList): void;
    moveCardTo(card: Card, destination: CardList): void;
    moveToTopOfDestination(destination: CardList): void;
    filter(query: Partial<Card>): Card[];
    count(query: Partial<Card>): number;
    sort(superType?: SuperType): void;
    private compareSupertype;
    private compareTrainerType;
    private compareEnergyType;
}
