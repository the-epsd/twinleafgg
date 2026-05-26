import { Prompt } from './prompt';
export declare class WaitPrompt extends Prompt<void> {
    readonly type: string;
    duration: number;
    message?: string;
    constructor(playerId: number, duration: number, message?: string);
}
