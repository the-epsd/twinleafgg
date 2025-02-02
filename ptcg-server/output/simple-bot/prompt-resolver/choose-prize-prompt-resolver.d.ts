import { State, Player, Prompt, Action } from '../../game';
import { PromptResolver } from './prompt-resolver';
export declare class ChoosePrizePromptResolver extends PromptResolver {
    resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined;
}
