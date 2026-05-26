import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
export interface ShowMulliganOptions {
    allowCancel: boolean;
}
export declare class ShowMulliganPrompt extends Prompt<true> {
    message: GameMessage;
    readonly type: string;
    options: ShowMulliganOptions;
    hands: Card[][];
    constructor(playerId: number, message: GameMessage, hands: Card[][], options?: Partial<ShowMulliganOptions>);
}
