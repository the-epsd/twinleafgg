import { Action } from '../actions/action';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
export declare function sandboxReducer(store: StoreLike, state: State, action: Action, clientRoleId: number): State;
