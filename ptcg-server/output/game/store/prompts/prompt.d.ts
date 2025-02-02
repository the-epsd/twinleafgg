import { State } from '../state/state';
export declare abstract class Prompt<T> {
    playerId: number;
    readonly abstract type: string;
    id: number;
    result: T | undefined;
    constructor(playerId: number);
    decode(result: any, state: State): T | null;
    validate(result: T | null, state: State): boolean;
}
