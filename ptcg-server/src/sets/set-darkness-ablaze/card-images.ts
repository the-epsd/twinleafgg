import { BirdKeeper } from './bird-keeper';
import { Kangaskhan } from './kangaskhan';
import { Lugia } from './lugia';
import { RoseTower } from './rose-tower';
import { TapuKoko } from './tapu-koko';

export class BirdKeeperArt extends BirdKeeper {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_159_R_EN_LG.png';
}

export class KangaskhanArt extends Kangaskhan {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_133_R_EN_LG.png';
}

export class LugiaArt extends Lugia {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_140_R_EN_LG.png';
}

export class RoseTowerArt extends RoseTower {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_169_R_EN_LG.png';
}

export class TapuKokoArt extends TapuKoko {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_061_R_EN_LG.png';
}