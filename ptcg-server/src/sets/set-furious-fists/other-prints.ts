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