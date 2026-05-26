import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
export interface ConfirmCardsOptions {
    allowCancel: boolean;
}
export declare class ConfirmCardsPrompt extends Prompt<true> {
    message: GameMessage;
    cards: Card[];
    readonly type: string;
    options: ConfirmCardsOptions;
    constructor(playerId: number, message: GameMessage, cards: Card[], options?: Partial<ConfirmCardsOptions>);
}
