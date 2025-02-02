import { Prompt } from '../store/prompts/prompt';
import { State } from '../store/state/state';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';
export declare class Arbiter {
    constructor();
    resolvePrompt(state: State, prompt: Prompt<any>): ResolvePromptAction | undefined;
    private shuffle;
}
