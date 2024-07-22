import { State } from '../state/state';

export interface ColorlessCostReducer {
  getColorlessReduction(state: State): number;
}
