import { Action } from '../actions/action';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
export declare function setupGame(next: Function, store: StoreLike, state: State): IterableIterator<State>;
export declare function setupPhaseReducer(store: StoreLike, state: State, action: Action): State;
