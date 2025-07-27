import { Korrina } from "./korrina";
import { SuperScoopUp } from "../set-diamond-and-pearl/super-scoop-up";

export class KorrinaFFI extends Korrina {
  public set: string = 'FFI';
  public setNumber: string = '111';
  public fullName: string = 'Korrina FFI 111';
}

export class SuperScoopUpFFI extends SuperScoopUp {
  public set: string = 'FFI';
  public setNumber: string = '100';
  public name: string = 'Super Scoop Up';
  public fullName: string = 'Super Scoop Up FFI';
  public text: string = 'Flip a coin. If heads, put 1 of your Pokémon and all cards attached to it into your hand.';
}