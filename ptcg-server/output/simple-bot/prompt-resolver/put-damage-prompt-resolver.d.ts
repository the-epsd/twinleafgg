import { Player, State, Action, Prompt, CardTarget, PokemonCardList, MoveDamagePrompt } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { PutDamagePrompt } from '../../game/store/prompts/put-damage-prompt';
export declare type DamagePromptResolverType = PutDamagePrompt | MoveDamagePrompt;
export interface DamagePromptResolverTarget {
    target: CardTarget;
    cardList: PokemonCardList;
    damage: number;
    hp: number;
    score: number;
}
export declare class PutDamagePromptResolver extends PromptResolver {
    resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined;
    private getPutDamagePromptResult;
    protected getTargets(state: State, prompt: DamagePromptResolverType, blocked: CardTarget[]): DamagePromptResolverTarget[];
}
