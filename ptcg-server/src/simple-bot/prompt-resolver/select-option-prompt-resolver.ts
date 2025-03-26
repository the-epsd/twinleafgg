import { Player, State, Action, Prompt } from '../../game';
import { PromptResolver } from './prompt-resolver';

export class SelectOptionPromptResolver extends PromptResolver {
  resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    return undefined; // Let the player make the choice
  }
} 