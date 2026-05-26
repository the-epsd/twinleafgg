import { CardType, Format } from '../store/card/card-types';
export declare class DeckAnalyser {
    cardNames: string[];
    private cards;
    constructor(cardNames?: string[]);
    isValid(format?: Format): boolean;
    getDeckType(): CardType[];
}
