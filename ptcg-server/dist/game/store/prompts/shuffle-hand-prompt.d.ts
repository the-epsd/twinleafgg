import { Prompt } from './prompt';
import { State } from '../state/state';
export declare class ShuffleHandPrompt extends Prompt<number[]> {
    readonly type: string;
    constructor(playerId: number);
    validate(result: number[] | null, state: State): boolean;
}
