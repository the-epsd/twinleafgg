import { Prompt } from './prompt';
import { GameMessage } from '../../game-message';
export declare class AlertPrompt extends Prompt<true> {
    message: GameMessage;
    readonly type: string;
    constructor(playerId: number, message: GameMessage);
}
