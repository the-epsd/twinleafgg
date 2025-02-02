import { Player, State, Action, Prompt } from '../../game';
import { PutDamagePromptResolver } from './put-damage-prompt-resolver';
export declare class MoveDamagePromptResolver extends PutDamagePromptResolver {
    resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined;
    private getMoveDamagePromptResult;
}
