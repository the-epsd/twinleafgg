import { Action } from './actions/action';
import { Effect } from './effects/effect';
import { GameLog } from '../game-message';
import { Prompt } from './prompts/prompt';
import { State } from './state/state';
import { StateLogParam } from './state/state-log';
import { StoreHandler } from './store-handler';
import { StoreLike } from './store-like';
export declare class Store implements StoreLike {
    private handler;
    state: State;
    private promptItems;
    private waitItems;
    private logId;
    constructor(handler: StoreHandler);
    dispatch(action: Action): State;
    reduceEffect(state: State, effect: Effect): State;
    compareEffects(effect1: Effect, effect2: Effect): boolean;
    prompt(state: State, prompts: Prompt<any>[] | Prompt<any>, then: (results: any) => void): State;
    waitPrompt(state: State, callback: () => void): State;
    log(state: State, message: GameLog, params?: StateLogParam, client?: number): void;
    private reducePrompt;
    private resolveWaitItems;
    hasPrompts(): boolean;
    private reduce;
    private propagateEffect;
}
