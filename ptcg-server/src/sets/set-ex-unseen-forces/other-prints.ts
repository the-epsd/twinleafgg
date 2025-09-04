import { BoostEnergy } from '../set-aquapolis/boost-energy';
import { PokeBall } from '../set-jungle/pokeball';
import { WarpEnergy } from '../set-shining-legends/warp-energy';

export class WarpEnergyUF extends WarpEnergy {
  public fullName = 'Warp Energy UF';
  public set = 'UF';
  public setNumber = '100';
  public text = 'Warp Energy provides [C] Energy. When you attach this card from your hand to your Active Pokémon, switch that Pokémon with 1 of your Benched Pokémon.';
}

export class BoostEnergyUF extends BoostEnergy {
  public fullName = 'Boost Energy UF';
  public set = 'UF';
  public setNumber = '98';
  public text = 'Boost Energy can be attached only to an Evolved Pokémon. Discard Boost Energy at the end of the turn it was attached. Boost Energy provides [C][C][C] Energy. The Pokémon Boost Energy is attached to can\'t retreat. When the Pokémon Boost Energy is attached to is no longer an Evolved Pokémon, discard Boost Energy.';
}

export class PokeBallUF extends PokeBall {
  public fullName = 'Poké Ball UF';
  public set = 'UF';
  public setNumber = '87';
  public text = 'Flip a coin. If heads, search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.';
}