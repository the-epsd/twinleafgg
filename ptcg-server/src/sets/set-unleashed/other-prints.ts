import { Jirachi } from "../set-call-of-legends/jirachi";
import { CheerleadersCheer } from "../set-call-of-legends/cheerleaders-cheer";
import { PlusPower } from "../set-base-set/pluspower";
import { Judge } from '../set-scarlet-and-violet/judge';
import { RareCandy } from '../set-ex-holon-phantoms/rare-candy';
import { SuperScoopUp } from '../set-diamond-and-pearl/super-scoop-up';

export class JudgeUL extends Judge {
  public fullName = 'Judge UL';
  public name = 'Judge';
  public set = 'UL';
  public setNumber = '78';
  public text = 'Each player shuffles his or her hand into his or her deck and draws 4 cards.';
}

export class RareCandyUL extends RareCandy {
  public fullName = 'Rare Candy UL';
  public name = 'Rare Candy';
  public set = 'UL';
  public setNumber = '82';
  public text = 'Choose 1 of your Basic Pokémon in play. If you have a Stage 1 or Stage 2 card that evolves from that Pokémon in your hand, put that card on the Basic Pokémon. (This counts as evolving that Pokémon.) If you choose a Stage 2 Pokémon in your hand, put that Pokémon on the Basic Pokémon instead of on a Stage 1 Pokémon.';
}

export class SuperScoopUpUL extends SuperScoopUp {
  public fullName = 'Super Scoop Up UL';
  public name = 'Super Scoop Up';
  public set = 'UL';
  public setNumber = '83';
  public text = 'Flip a coin. If heads, return 1 of your Pokémon and all cards attached to it to your hand.';
}
export class JirachiUL extends Jirachi {
  public setNumber = '1';
  public fullName: string = 'Jirachi UL';
  public set = 'UL';
}

export class CheerleadersCheerUL extends CheerleadersCheer {
  public setNumber = '71';
  public fullName: string = 'Cheerleader\'s Cheer UL';
  public set = 'UL';
}

export class PlusPowerUL extends PlusPower {
  public setNumber = '80';
  public fullName: string = 'PlusPower UL';
  public set = 'UL';
}
