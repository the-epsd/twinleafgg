import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
export interface SelectOptions {
    allowCancel: boolean;
    defaultValue: number;
}
export declare class SelectPrompt extends Prompt<number> {
    message: GameMessage;
    values: string[];
    readonly type: string;
    options: SelectOptions;
    constructor(playerId: number, message: GameMessage, values: string[], options?: Partial<SelectOptions>);
}
