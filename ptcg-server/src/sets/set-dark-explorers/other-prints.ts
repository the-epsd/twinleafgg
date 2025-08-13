import { DarkPatch } from '../set-astral-radiance/dark-patch';
import { DarkraiEx } from './darkrai-ex';
import { EnhancedHammer } from '../set-twilight-masquerade/enhanced-hammer';
import { ProfessorJuniper } from '../set-black-and-white/professor-juniper';
import { RareCandy } from '../set-scarlet-and-violet/rare-candy';

export class DarkPatchDEX extends DarkPatch {
  public setNumber = '93';
  public fullName: string = 'Dark Patch DEX';
  public set = 'DEX';
}

export class DarkraiExDEX extends DarkraiEx {
  public setNumber = '107';
  public fullName: string = 'Darkrai EX DEX 107';
  public set = 'DEX';
}

export class EnhancedHammerDEX extends EnhancedHammer {
  public setNumber = '94';
  public fullName: string = 'Enhanced Hammer DEX';
  public set = 'DEX';
}

export class ProfessorJuniperDEX extends ProfessorJuniper {
  public setNumber = '98';
  public fullName: string = 'Professor Juniper DEX';
  public set = 'DEX';
}

export class RareCandyDEX extends RareCandy {
  public setNumber = '100';
  public fullName: string = 'Rare Candy DEX';
  public set = 'DEX';
  public text = 'Choose 1 of your Basic Pokémon in play. If you have a Stage 2 card in your hand that evolves from that Pokémon, put that card on the Basic Pokémon. (This counts as evolving that Pokémon.) You can\'t use this card during your first turn or on a Basic Pokémon that was put into play this turn.';
  public regulationMark: string = '';
}