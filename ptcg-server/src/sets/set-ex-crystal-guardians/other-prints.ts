import { PokeBall } from '../set-jungle/pokeball';
import { Potion } from '../set-base-set/potion';
import { WarpPointMA } from '../set-ex-team-magma-vs-team-aqua/other-prints';

export class PokeBallCG extends PokeBall {
  public fullName = 'Poké Ball CG';
  public set = 'CG';
  public setNumber = '82';
  public text = 'Flip a coin. If heads, search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.';
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