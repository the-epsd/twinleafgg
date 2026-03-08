import { BillsMaintenance } from '../set-ex-firered-leafgreen/bills-maintenance';
import { DualBall } from '../set-unleashed/dual-ball';
import { EnergySearch } from '../set-scarlet-and-violet/energy-search';
import { PokeBall } from '../set-jungle/pokeball';
import { PokeNav } from '../set-ex-ruby-and-sapphire/pokenav';
import { Potion } from '../set-base-set/potion';
import { WarpPointMA } from '../set-ex-team-magma-vs-team-aqua/other-prints';

export class BillsMaintenanceCG extends BillsMaintenance {
  public fullName = 'Bills Maintenance CG';
  public set = 'CG';
  public setNumber = '71';
}

export class DualBallCG extends DualBall {
  public fullName = 'Dual Ball CG';
  public set = 'CG';
  public setNumber = '78';
  public text = 'Flip 2 coins. For each heads, search your deck for a Basic Pokémon card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
}

export class EnergySearchCG extends EnergySearch {
  public fullName = 'Energy Search CG';
  public set = 'CG';
  public setNumber = '86';
  public text = 'Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
}

export class PokeBallCG extends PokeBall {
  public fullName = 'Poké Ball CG';
  public set = 'CG';
  public setNumber = '82';
  public text = 'Flip a coin. If heads, search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.';
}

export class PokeNavCG extends PokeNav {
  public fullName = 'PokéNav CG';
  public set = 'CG';
  public setNumber = '83';
}

export class PotionCG extends Potion {
  public fullName = 'Potion CG';
  public set = 'CG';
  public setNumber = '87';
  public text = 'Remove 2 damage counters from 1 of your Pokémon (remove 1 damage counter if that Pokémon has only 1).';
}

export class WarpPointCG extends WarpPointMA {
  public fullName = 'Warp Point CG';
  public set = 'CG';
  public setNumber = '84';
}