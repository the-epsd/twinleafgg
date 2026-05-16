import { State } from './state/state';
import { Action } from './actions/action';

export interface StoreHandler {

  onAction?(action: Action, state: State): void;

  onStateChange(state: State): void;

}
