import { Player, State, Action, Prompt } from '../../game';
import { PromptResolver } from './prompt-resolver';
export declare class ChoosePokemonPromptResolver extends PromptResolver {
    resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined;
    private getPromptResult;
    private getPokemonScoreForPrompt;
    private buildPokemonToChoose;
}
