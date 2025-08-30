import { Action } from './action';

export class ConcedeAction implements Action {

  readonly type: string = 'CONCEDE_GAME';

  constructor(public playerId: number) { }

}