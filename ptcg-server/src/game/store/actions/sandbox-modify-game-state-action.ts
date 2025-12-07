import { Action } from './action';
import { GamePhase } from '../state/state';
import { Rules } from '../state/rules';

export class SandboxModifyGameStateAction implements Action {

  readonly type: string = 'SANDBOX_MODIFY_GAME_STATE';

  constructor(
    public clientId: number,
    public modifications: {
      turn?: number;
      phase?: GamePhase;
      activePlayer?: number;
      skipOpponentTurn?: boolean;
      isSuddenDeath?: boolean;
      rules?: Partial<Rules>;
    }
  ) { }

}


