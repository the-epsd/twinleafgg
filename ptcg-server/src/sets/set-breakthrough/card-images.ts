import { Brigette } from './brigette';
import { Florges } from './florges';
import { Octillery } from './octillery';
import { ParallelCity } from './parallel-city';
import { TownMap } from './town-map';

export class BrigetteArt extends Brigette {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_134_R_EN_LG.png';
}

export class TownMapArt extends TownMap {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_150_R_EN.png';
}

export class FlorgesArt extends Florges {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_103_R_EN_LG.png';
}

export class OctilleryArt extends Octillery {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_033_R_EN_LG.png';
}

export class ParallelCityArt extends ParallelCity {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_145_R_EN_LG.png';
}