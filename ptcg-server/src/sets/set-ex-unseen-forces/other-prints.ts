import { BoostEnergy } from '../set-aquapolis/boost-energy';
import { CycloneEnergy } from '../set-ex-power-keepers/cyclone-energy';
import { DarknessEnergySpecial } from '../set-ex-ruby-and-sapphire/darkness-energy-special';
import { MetalEnergySpecial } from '../set-undaunted/metal-energy-special';
import { PokeBall } from '../set-jungle/pokeball';
import { WarpEnergy } from '../set-shining-legends/warp-energy';
import { WarpPointMA } from '../set-ex-team-magma-vs-team-aqua/other-prints';

export class BoostEnergyUF extends BoostEnergy {
  public fullName = 'Boost Energy UF';
  public set = 'UF';
  public setNumber = '98';
  public text = 'Boost Energy can be attached only to an Evolved Pokémon. Discard Boost Energy at the end of the turn it was attached. Boost Energy provides [C][C][C] Energy. The Pokémon Boost Energy is attached to can\'t retreat. When the Pokémon Boost Energy is attached to is no longer an Evolved Pokémon, discard Boost Energy.';
}

export class CycloneEnergyUF extends CycloneEnergy {
  public fullName = 'Cyclone Energy UF';
  public set = 'UF';
  public setNumber = '99';
}

export class DarknessEnergySpecialUF extends DarknessEnergySpecial {
  public fullName = 'Darkness Energy Special UF';
  public set = 'UF';
  public setNumber = '96';
}

export class MetalEnergySpecialUF extends MetalEnergySpecial {
  public fullName = 'Metal Energy Special UF';
  public set = 'UF';
  public setNumber = '97';
  public text = 'Damage done by attacks to the Pokémon that Metal Energy is attached to is reduced by 10 (after applying Weakness and Resistance). Ignore this effect if the Pokémon that Metal Energy is attached to isn\'t [M]. Metal Energy provides [M] Energy. (Doesn\'t count as a basic Energy card.)';
}

export class PokeBallUF extends PokeBall {
  public fullName = 'Poké Ball UF';
  public set = 'UF';
  public setNumber = '87';
  public text = 'Flip a coin. If heads, search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.';
}

export class WarpEnergyUF extends WarpEnergy {
  public fullName = 'Warp Energy UF';
  public set = 'UF';
  public setNumber = '100';
  public text = 'Warp Energy provides [C] Energy. When you attach this card from your hand to your Active Pokémon, switch that Pokémon with 1 of your Benched Pokémon.';
}

export class WarpPointUF extends WarpPointMA {
  public fullName = 'Warp Point UF';
  public set = 'UF';
  public setNumber = '93';
}