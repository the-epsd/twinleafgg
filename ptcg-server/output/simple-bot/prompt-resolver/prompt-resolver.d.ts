import { Player, State, Action, Prompt } from '../../game';
import { SimpleBotOptions } from '../simple-bot-options';
import { StateScore } from '../state-score/state-score';
export declare type PromptResolverList = (new (options: SimpleBotOptions) => PromptResolver)[];
export declare abstract class PromptResolver {
    protected options: SimpleBotOptions;
    protected stateScore: StateScore;
    constructor(options: SimpleBotOptions);
    abstract resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined;
    protected getStateScore(state: State, playerId: number): number;
}
