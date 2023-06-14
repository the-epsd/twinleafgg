import { State, GameWinner } from '../state/state';
import { StoreLike } from '../store-like';
import { Effect } from '../effects/effect';
export declare function endGame(store: StoreLike, state: State, winner: GameWinner): State;
export declare function checkState(store: StoreLike, state: State, onComplete?: () => void): State;
export declare function checkStateReducer(store: StoreLike, state: State, effect: Effect): State;
