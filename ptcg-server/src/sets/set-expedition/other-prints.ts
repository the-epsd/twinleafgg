import { Copycat } from "../set-ex-dragon-frontiers/copycat";
import { DualBall } from "../set-unleashed/dual-ball";
import { EnergySearch } from "../set-scarlet-and-violet/energy-search";
import { PokemonReversal } from "../set-ex-unseen-forces/pokemon-reversal";
import { ProfessorElmsTrainingMethod } from "../set-ex-unseen-forces/professors-elm-training-method";
import { ProfessorOaksResearch } from "../set-ex-dragon-frontiers/professor-oaks-research";
import { StrengthCharm } from "../set-ex-dragon-frontiers/strength-charm";
import { Switch } from "../set-scarlet-and-violet/switch";

export class CopycatEX extends Copycat {
  public fullName = 'Copycat EX';
  public set = 'EX';
  public setNumber = '138';
  public text = 'Shuffle your hand into your deck. Then, count the number of cards in your opponent\'s hand and draw that many cards.';
}

export class DualBallEX extends DualBall {
  public fullName = 'Dual Ball EX';
  public set = 'EX';
  public setNumber = '139';
  public text = 'Flip 2 coins. For each heads, search your deck for a Basic Pokémon, show it to your opponent, and put it into your hand. If you do, shuffle your deck afterward.';
}

export class EnergySearchEX extends EnergySearch {
  public fullName = 'Energy Search EX';
  public set = 'EX';
  public setNumber = '153';
  public text = 'Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
}

export class PokemonReversalEX extends PokemonReversal {
  public fullName = 'Pokémon Reversal EX';
  public set = 'EX';
  public setNumber = '146';
  public text = 'Choose 1 of your opponent\'s Benched Pokémon. Flip a coin. If heads, switch that Pokémon with the Defending Pokémon.';
}

export class ProfessorElmsTrainingMethodEX extends ProfessorElmsTrainingMethod {
  public fullName = 'Professor Elm\'s Training Method EX';
  public set = 'EX';
  public setNumber = '148';
  public text = 'Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
}

export class ProfessorOaksResearchEX extends ProfessorOaksResearch {
  public fullName = 'Professor Oak\'s Research EX';
  public set = 'EX';
  public setNumber = '149';
  public text = 'Shuffle your hand into your deck, then draw 5 cards.'
}

export class StrengthCharmEX extends StrengthCharm {
  public fullName = 'Strength Charm EX';
  public set = 'EX';
  public setNumber = '150';
  public text = 'Whenever an attack from the Pokémon that Strength Charm is attached to does damage (after applying Weakness and Resistance), the attack does 10 more damage. At the end of your turn in which this happens, discard Strength Charm.';
}

export class SwitchEX extends Switch {
  public fullName = 'Switch EX';
  public set = 'EX';
  public setNumber = '157';
  public text = 'Switch your Active Pokémon with 1 of your Benched Pokémon.';
}