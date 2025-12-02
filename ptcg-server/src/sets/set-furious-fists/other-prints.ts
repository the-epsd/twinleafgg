import { EnergySwitchPK } from "../set-ex-power-keepers/other-prints";
import { FullHeal } from "../set-base-set/full-heal";
import { SeismitoadEx as SeismitoadExFFI20 } from "../set-furious-fists/seismitoad-ex";
import { LucarioEx as LucarioExFFI54 } from "../set-furious-fists/lucario-ex";
import { Korrina } from './korrina';
import { Maintenance } from '../set-base-set/maintenance';
import { SuperScoopUp } from '../set-diamond-and-pearl/super-scoop-up';

export class KorrinaFFI extends Korrina {
  public set: string = 'FFI';
  public setNumber: string = '111';
  public fullName: string = 'Korrina FFI 111';
}

export class MaintenanceFFI extends Maintenance {
  public set: string = 'FFI';
  public setNumber: string = '96';
  public fullName: string = 'Maintenance FFI 96';
  public text: string = 'Shuffle 2 cards from your hand into your deck. (If you can\'t shuffle 2 cards into your deck, you can\'t play this card.) Then, draw a card.';
}

export class SuperScoopUpFFI extends SuperScoopUp {
  public set: string = 'FFI';
  public setNumber: string = '100';
  public name: string = 'Super Scoop Up';
  public fullName: string = 'Super Scoop Up FFI';
  public text: string = 'Flip a coin. If heads, put 1 of your Pokémon and all cards attached to it into your hand.';
}
export class EnergySwitchPKFFI extends EnergySwitchPK {
  public setNumber = '89';
  public fullName: string = 'Energy Switch FFI';
  public set = 'FFI';
}

export class FullHealFFI extends FullHeal {
  public setNumber = '93';
  public fullName: string = 'Full Heal FFI';
  public set = 'FFI';
}

export class SeismitoadEx2FFI extends SeismitoadExFFI20 {
  public setNumber = '106';
  public fullName: string = 'Seismitoad EX2 FFI';
  public set = 'FFI';
}

export class LucarioEx2FFI extends LucarioExFFI54 {
  public setNumber = '107';
  public fullName: string = 'Lucario EX2 FFI';
  public set = 'FFI';
}
