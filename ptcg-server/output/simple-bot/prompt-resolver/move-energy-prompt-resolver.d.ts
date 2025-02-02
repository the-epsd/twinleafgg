import { Player, State, Action, Prompt } from '../../game';
import { PromptResolver } from './prompt-resolver';
export declare class MoveEnergyPromptResolver extends PromptResolver {
    resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined;
    private getPromptResult;
    private translateItems;
    private buildTransferItems;
    private buildFromCardItems;
    private getTargets;
}
