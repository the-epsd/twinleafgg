import { EnergyRecycler } from "../set-battle-styles/energy-recycler";
import { MarniesMorpeko } from "./marnies-morpeko";
import { StevensBeldum } from "./stevens-beldum";

export class EnergyRecyclerSV10 extends EnergyRecycler {
  public regulationMark = 'I';
  public fullName = 'Energy Recycler SV10';
  public set = 'SV10';
  public setNumber = '8';
}

export class MarniesMorpekoIR extends MarniesMorpeko {
  public fullName = 'Marnie\'s MorpekoIR SVOM';
  public setNumber = '20';
}

export class StevensBeldumIR extends StevensBeldum {
  public fullName = 'Steven\'s BeldumIR SVOD';
  public setNumber = '19';
}