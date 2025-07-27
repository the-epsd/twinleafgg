import { EscapeRope } from "../set-battle-styles/escape-rope";
import { Guzma } from "./guzma";
import { RescueStretcher } from "../set-guardians-rising/rescue-stretcher";
import { WeaknessPolicy } from "../set-primal-clash/weakness-policy";

export class EscapeRopeBUS extends EscapeRope {
  public fullName = 'Escape Rope BUS';
  public name = 'Escape Rope';
  public set = 'BUS';
  public setNumber = '114';
  public text = 'Each player switches their Active Pokémon with 1 of their Benched Pokémon. (Your opponent switches first. If a player does not have a Benched Pokémon, that player doesn\'t switch Pokémon.)';
}

export class GuzmaBUS extends Guzma {
  public fullName = 'Guzma BUS 115a';
  public set = 'BUS';
  public setNumber = '115a';
}

export class GuzmaBUS2 extends Guzma {
  public fullName = 'Guzma BUS 143';
  public set = 'BUS';
  public setNumber = '143';
}

export class RescueStretcherBUS extends RescueStretcher {
  public fullName = 'Rescue Stretcher BUS 165';
  public set = 'BUS';
  public setNumber = '165';
}

export class WeaknessPolicyBUS extends WeaknessPolicy {
  public fullName = 'Weakness Policy BUS';
  public name = 'Weakness Policy';
  public set = 'BUS';
  public setNumber = '126';
  public text = 'The Pokémon this card is attached to has no Weakness.'
}