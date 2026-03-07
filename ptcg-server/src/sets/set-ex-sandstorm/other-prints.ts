import { ClawFossil } from '../set-ex-power-keepers/claw-fossil';
import { Marill } from './marill';
import { MysteriousFossil } from '../set-fossil/mysterious-fossil';
import { Ralts2 } from '../set-ex-dragon-frontiers/ralts2';
import { RareCandy } from '../set-ex-holon-phantoms/rare-candy';

export class ClawFossilSS extends ClawFossil {
  public set = 'SS';
  public setNumber = '90';
  public fullName = 'Claw Fossil SS';
}

// This was a misprint with the wrong retreat cost, but officially ruled to be playable as having the 0 retreat
export class MarillMisprint extends Marill {
  public set = 'SS';
  public setNumber = '68a';
  public fullName = 'Marill SS (Misprint)';
  public retreat = [];
}

export class MysteriousFossilSS extends MysteriousFossil {
  public set = 'SS';
  public setNumber = '91';
  public fullName = 'Mysterious Fossil SS';
}

export class RaltsSS extends Ralts2 {
  public set = 'SS';
  public setNumber = '74';
  public fullName = 'Ralts SS';
}

export class RareCandySS extends RareCandy {
  public set = 'SS';
  public setNumber = '88';
  public fullName = 'Rare Candy SS';
  public text = 'Choose 1 of your Basic Pokémon in play. If you have a Stage 1 or Stage 2 card that evolves from that Pokémon in your hand, put that card on the Basic Pokémon. (This counts as evolving that Pokémon.)';
}