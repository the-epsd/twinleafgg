import { Prompt } from '../store/prompts/prompt';
import { State } from '../store/state/state';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';
export declare enum BotFlipMode {
    ALL_HEADS = 0,
    ALL_TAILS = 1,
    RANDOM = 2
}
export declare enum BotShuffleMode {
    NO_SHUFFLE = 0,
    REVERSE = 1,
    RANDOM = 2
}
export interface BotArbiterOptions {
    flipMode: BotFlipMode;
    shuffleMode: BotShuffleMode;
}
export declare class BotArbiter {
    private options;
    private flipCount;
    constructor(options?: Partial<BotArbiterOptions>);
    resolvePrompt(state: State, prompt: Prompt<any>): ResolvePromptAction | undefined;
    private shuffle;
}
