import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
export interface ShowCardsOptions {
    allowCancel: boolean;
}
export declare class ShowCardsPrompt extends Prompt<true> {
    message: GameMessage;
    cards: Card[];
    readonly type: string;
    options: ShowCardsOptions;
    constructor(playerId: number, message: GameMessage, cards: Card[], options?: Partial<ShowCardsOptions>);
}
