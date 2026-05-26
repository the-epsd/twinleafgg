import { Action } from '../store/actions/action';
import { Prompt } from '../store/prompts/prompt';
import { State } from '../store/state/state';
export declare type HeadlessPromptOverride = (prompt: Prompt<any>, state: State) => any;
export declare class HeadlessPromptResolver {
    private overrides;
    overrideOnce(promptType: string, handler: HeadlessPromptOverride): void;
    resolve(state: State, prompt: Prompt<any>): Action;
    private toAction;
    private defaultRawResult;
    private resolveShuffleRaw;
    private resolveChooseCardsRaw;
    private getPromptPlayers;
    private toTargetKey;
    private resolveChoosePokemonRaw;
    private cardMatchesPartialFilter;
    private resolveAttachEnergyRaw;
    private buildTargets;
    private resolveChooseEnergyRaw;
    private resolveChoosePrizeRaw;
    private resolvePutDamageRaw;
    private resolveDiscardEnergyRaw;
}
