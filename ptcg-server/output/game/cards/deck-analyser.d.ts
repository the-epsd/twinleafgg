import { CardType } from '../store/card/card-types';
export declare class DeckAnalyser {
    cardNames: string[];
    private cards;
    constructor(cardNames?: string[]);
    isValid(): boolean;
    getDeckType(): CardType[];
}
