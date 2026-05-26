import { Prompt } from './prompt';
import { GameMessage } from '../../game-message';
export declare class CoinFlipPrompt extends Prompt<boolean> {
    message: GameMessage;
    readonly type: string;
    constructor(playerId: number, message: GameMessage);
}
