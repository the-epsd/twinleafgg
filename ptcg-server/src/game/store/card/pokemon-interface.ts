import { State } from '../state/state';

export interface ColorlessCostReducer {
  getColorlessReduction(state: State): number;
}

export interface WaterCostReducer {
  getWaterReduction(state: State): number;
}

export interface DarkCostReducer {
  getDarkReduction(state: State): number;
}