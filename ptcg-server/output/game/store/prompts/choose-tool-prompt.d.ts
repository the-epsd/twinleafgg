import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { State } from '../state/state';
export declare const ChooseToolPromptType = "Choose tool";
export interface ChooseToolOptions {
    min: number;
    max: number;
    allowCancel: boolean;
}
export declare class ChooseToolPrompt extends Prompt<Card[]> {
    message: GameMessage;
    tools: Card[];
    readonly type: string;
    options: ChooseToolOptions;
    constructor(playerId: number, message: GameMessage, tools: Card[], options?: Partial<ChooseToolOptions>);
    decode(result: number[] | null): Card[] | null;
    validate(result: Card[] | null, state: State): boolean;
}
