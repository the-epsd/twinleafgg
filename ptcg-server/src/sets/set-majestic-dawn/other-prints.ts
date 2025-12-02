import { DuskBall } from "../set-surging-sparks/dusk-ball";
import { PokeBall } from "../set-jungle/pokeball";
import { SuperScoopUp } from "../set-diamond-and-pearl/super-scoop-up";
import { EnergySearch } from "../set-fossil/energy-search";
import { DarknessEnergySpecial } from "../set-neo-genesis/darkness-energy-special";
import { MetalEnergyN1 } from "../set-neo-genesis/other-prints";
import { EscapeRope } from '../set-plasma-storm/escape-rope';

export class WarpPointMD extends EscapeRope {
  public fullName = 'Warp Point MD';
  public name = 'Warp Point';
  public set = 'MD';
  public setNumber = '88';
  public text = 'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with his or her Active Pokémon, then, if you have any Benched Pokémon, you switch 1 of them with your Active Pokémon.';
}
export class DuskBallMD extends DuskBall {
  public setNumber = '80';
  public fullName: string = 'Dusk Ball MD';
  public set = 'MD';
}

export class PokeBallMD extends PokeBall {
  public setNumber = '85';
  public fullName: string = 'Poké Ball MD';
  public set = 'MD';
}

export class SuperScoopUpMD extends SuperScoopUp {
  public setNumber = '87';
  public fullName: string = 'Super Scoop Up MD';
  public set = 'MD';
}

export class EnergySearchMD extends EnergySearch {
  public setNumber = '90';
  public fullName: string = 'Energy Search MD';
  public set = 'MD';
}

export class DarknessEnergySpecialMD extends DarknessEnergySpecial {
  public setNumber = '93';
  public fullName: string = 'Darkness Energy MD';
  public set = 'MD';
}

export class MetalEnergyN1MD extends MetalEnergyN1 {
  public setNumber = '95';
  public fullName: string = 'Metal Energy MD';
  public set = 'MD';
}
