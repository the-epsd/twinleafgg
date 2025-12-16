import { Action } from './action';

export class SandboxModifyPlayerAction implements Action {

  readonly type: string = 'SANDBOX_MODIFY_PLAYER';

  constructor(
    public clientId: number,
    public targetPlayerId: number,
    public modifications: {
      prizes?: number;
      handSize?: number;
      deckSize?: number;
      discardSize?: number;
      lostzoneSize?: number;
      supporterTurn?: number;
      retreatedTurn?: number;
      energyPlayedTurn?: number;
      stadiumPlayedTurn?: number;
      stadiumUsedTurn?: number;
      usedVSTAR?: boolean;
      usedGX?: boolean;
      ancientSupporter?: boolean;
      rocketSupporter?: boolean;
    }
  ) { }

}


