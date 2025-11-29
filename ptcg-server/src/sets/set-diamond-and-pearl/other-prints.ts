import { EnergySwitchPK } from "../set-ex-power-keepers/other-prints";
import { PokeBall } from "../set-jungle/pokeball";
import { WarpPointG2 } from "../set-gym-challenge/other-prints";
import { EnergySearch } from "../set-fossil/energy-search";
import { Potion } from "../set-base-set/potion";
import { Switch } from '../set-scarlet-and-violet/switch';

export class SwitchDP extends Switch {
  public set: string = 'DP';
  public setNumber: string = '119';
  public regulationMark = '';
  public fullName: string = 'Switch DP';
  public text: string = 'Switch 1 of your Active Pokémon with 1 of your Benched Pokémon.';
}
export class EnergySwitchPKDP extends EnergySwitchPK {
  public setNumber = '107';
  public fullName: string = 'Energy Switch DP';
  public set = 'DP';
}

export class PokeBallDP extends PokeBall {
  public setNumber = '110';
  public fullName: string = 'Poké Ball DP';
  public set = 'DP';
}

export class WarpPointG2DP extends WarpPointG2 {
  public setNumber = '116';
  public fullName: string = 'Warp Point DP';
  public set = 'DP';
}

export class EnergySearchDP extends EnergySearch {
  public setNumber = '117';
  public fullName: string = 'Energy Search DP';
  public set = 'DP';
}

export class PotionDP extends Potion {
  public setNumber = '118';
  public fullName: string = 'Potion DP';
  public set = 'DP';
}
