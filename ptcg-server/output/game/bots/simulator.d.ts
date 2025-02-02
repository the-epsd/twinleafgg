import { Store } from '../store/store';
import { Action } from '../store/actions/action';
import { BotArbiterOptions } from './bot-arbiter';
import { State } from '../store/state/state';
import { StoreHandler } from '../store/store-handler';
export declare class Simulator implements StoreHandler {
    store: Store;
    private botArbiter;
    constructor(state: State, botArbiterOptions?: Partial<BotArbiterOptions>);
    clone(): Simulator;
    onStateChange(state: State): void;
    private handleArbiterPrompts;
    dispatch(action: Action): State;
}
