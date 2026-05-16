
export interface ReplayOptions {
  indexEnabled: boolean;
  appendEnabled: boolean;
}

export interface ReplayActionRecord {
  sequence: number;
  type: string;
  turn: number;
  phase: number;
  activePlayer: number;
  stateIndex: number;
  payload: any;
}

export interface ReplayPlayer {

  userId: number;

  name: string;

}
