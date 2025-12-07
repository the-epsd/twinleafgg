import { Action } from './action';

export class SandboxModifyPokemonAction implements Action {

  readonly type: string = 'SANDBOX_MODIFY_POKEMON';

  constructor(
    public clientId: number,
    public targetPlayerId: number,
    public location: 'active' | 'bench',
    public modifications: {
      damage?: number;
      hp?: number;
      energyCount?: number;
      energyTypes?: string[];
      conditions?: {
        burned?: boolean;
        poisoned?: boolean;
        asleep?: boolean;
        paralyzed?: boolean;
        confused?: boolean;
      };
      markers?: { [key: string]: boolean };
    },
    public benchIndex?: number
  ) { }

}

