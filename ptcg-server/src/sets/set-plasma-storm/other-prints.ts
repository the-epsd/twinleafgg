import { Eviolite } from '../set-noble-victories/eviolite';
import { VictiniEX as VictiniEXPLS18 } from '../set-plasma-storm/victini-ex';
import { LugiaEx as LugiaExPLS108 } from '../set-plasma-storm/lugia-ex';
import { Colress as ColressPLS118 } from '../set-plasma-storm/colress';
import { Blastoise } from '../set-boundaries-crossed/blastoise';
import { RandomReceiver } from '../set-dark-explorers/random-receiver';
import { ArticunoEx } from './articuno-ex';
import { CobalionEx } from './cobalion-ex';
import { Charizard } from '../set-boundaries-crossed/charizard';

export class EviolitePLS extends Eviolite {
  public setNumber = '122';
  public fullName: string = 'Eviolite PLS';
  public set = 'PLS';
}

export class VictiniEX2PLS extends VictiniEXPLS18 {
  public setNumber = '131';
  public fullName: string = 'Victini EX2 PLS';
  public set = 'PLS';
}

export class LugiaEx2PLS extends LugiaExPLS108 {
  public setNumber = '134';
  public fullName: string = 'Lugia EX2 PLS';
  public set = 'PLS';
}

export class Colress2PLS extends ColressPLS118 {
  public setNumber = '135';
  public fullName: string = 'Colress2 PLS';
  public set = 'PLS';
}

export class BlastoisePLS extends Blastoise {
  public setNumber = '137';
  public fullName: string = 'Blastoise PLS';
  public set = 'PLS';
}

export class RandomReceiverPLS extends RandomReceiver {
  public setNumber = '138';
  public fullName: string = 'Random Receiver PLS';
  public set = 'PLS';
}

export class ArticunoEx2 extends ArticunoEx {
  public set: string = 'PLS';
  public setNumber: string = '132';
  public fullName: string = 'Articuno-EX PLS 132';
}

export class CobalionEx2 extends CobalionEx {
  public set: string = 'PLS';
  public setNumber: string = '133';
  public fullName: string = 'Cobalion-EX PLS 133';
}

export class CharizardPLS extends Charizard {
  public set: string = 'PLS';
  public setNumber: string = '136';
  public fullName: string = 'Charizard PLS';
}
