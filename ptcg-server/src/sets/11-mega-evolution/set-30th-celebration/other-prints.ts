import { Eevee2 } from './eevee-2';
import { UltraBallMEG, SwitchMEG } from '../set-mega-evolution/other-prints';
import { PokePad } from '../set-ascended-heroes/poke-pad';

export class Eevee118 extends Eevee2 {
  public setNumber: string = '118';
  public fullName: string = 'Eevee 30C 2';
}

export class PokePad30C extends PokePad {
  public setNumber = '126';
  public fullName: string = 'Poké Pad 30C';
  public set = '30C';
}

export class Switch30C extends SwitchMEG {
  public setNumber = '127';
  public fullName: string = 'Switch 30C';
  public set = '30C';
}

export class UltraBall30C extends UltraBallMEG {
  public setNumber = '128';
  public fullName: string = 'Ultra Ball 30C';
  public set = '30C';
}
