import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
export interface SelectOptionOptions {
    allowCancel: boolean;
    defaultValue: number;
    disabled?: boolean[];
}
export declare class SelectOptionPrompt extends Prompt<number> {
    message: GameMessage;
    values: string[];
    readonly type: string;
    options: SelectOptionOptions;
    constructor(playerId: number, message: GameMessage, values: string[], options?: Partial<SelectOptionOptions>);
}
