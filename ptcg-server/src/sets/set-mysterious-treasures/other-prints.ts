import { MultiEnergy } from "../set-ex-sandstorm/multi-energy";
import { SuperRod } from "../set-noble-victories/super-rod";

export class MultiEnergyMT extends MultiEnergy {
  public fullName = 'Multi Energy MT';
  public name = 'Multi Energy';
  public set = 'MT';
  public setNumber = '118';
  public text = 'ThAttach Multi Energy to 1 of your Pokémon. While in play, Multi Energy provides every type of Energy but provides only 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) Multi energy provides [C] Energy when attached to a Pokémon that already has Special Energy cards attached to it.';
}

export class NightMaintenanceMT extends SuperRod {
  public fullName = 'Night Maintenance MT';
  public name = 'Night Maintenance';
  public set = 'MT';
  public setNumber = '113';
  public text = 'Search your discard pile for up to 3 in any combination of Pokémon and basic Energy cards. Show them to your opponent and shuffle them into your deck.';
}