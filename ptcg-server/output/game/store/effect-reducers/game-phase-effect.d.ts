import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
export declare function betweenTurns(store: StoreLike, state: State, onComplete: () => void): State;
export declare function initNextTurn(store: StoreLike, state: State): State;
export declare function gamePhaseReducer(store: StoreLike, state: State, effect: Effect): State;
