import { Effect } from '../effects/effect';
import { GameWinner, State } from '../state/state';
import { StoreLike } from '../store-like';
export declare function endGame(store: StoreLike, state: State, winner: GameWinner): State;
export declare function checkWinner(store: StoreLike, state: State, onComplete?: () => void): State;
export declare function executeCheckState(next: Function, store: StoreLike, state: State, onComplete?: () => void): IterableIterator<State>;
export declare function checkState(store: StoreLike, state: State, onComplete?: () => void): State;
export declare function checkStateReducer(store: StoreLike, state: State, effect: Effect): State;
