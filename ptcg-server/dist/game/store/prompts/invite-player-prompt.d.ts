import { Prompt } from './prompt';
import { GameMessage } from '../../game-message';
export declare class InvitePlayerPrompt extends Prompt<string[]> {
    message: GameMessage;
    readonly type: string;
    constructor(playerId: number, message: GameMessage);
}
