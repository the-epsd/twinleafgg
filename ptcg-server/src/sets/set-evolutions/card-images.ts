import { DarknessEnergy } from '../set-diamond-and-pearl/darkness-energy';
import { DevolutionSpray } from './devolution-spray';
import { DragoniteEX } from './dragonite-ex';
import { Electabuzz } from './electabuzz';
import { Poliwhirl } from './EVO_24_Poliwhirl';
import { Pokedex } from './pokedex';
import { Starmie } from './starmie';

export class DevolutionSprayArt extends DevolutionSpray {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_076_R_EN_LG.png';
}

export class DragoniteEXArt extends DragoniteEX {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_072_R_EN.png';
}

export class ElectabuzzArt extends Electabuzz {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_041_R_EN.png';
}

export class PokedexArt extends Pokedex {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_082_R_EN_LG.png';
}

export class PoliwhirlArt extends Poliwhirl {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_024_R_EN_LG.png';
}

export class StarmieArt extends Starmie {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_031_R_EN_LG.png';
}

//Energy

export class DarknessEnergyArt extends DarknessEnergy {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_097_R_EN.png';
  public set = 'EVO';
  public setNumber = '097';
  public fullName = 'Darkness Energy EVO';
}