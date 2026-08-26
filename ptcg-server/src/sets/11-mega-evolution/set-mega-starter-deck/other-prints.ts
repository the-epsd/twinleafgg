import { Eevee } from "./eevee";
import { Sprigatito } from "./sprigatito";
import { Zorua } from "./zorua";

export class SprigatitoIR extends Sprigatito {
  public setNumber = '18';
  public fullName: string = 'SprigatitoIR MEM';
  public set = 'J-MEM';
}

export class ZoruaIR extends Zorua {
  public setNumber = '20';
  public fullName: string = 'ZoruaIR MEZ';
  public set = 'J-MEZ';
}

export class EeveeIR extends Eevee {
  public setNumber = '20';
  public fullName: string = 'EeveeIR MEE';
  public set = 'J-MEE';
}