import { PalaceBook } from './palace-book';
import { PikachuZekromGX } from './SMP_168_Pikachu&ZekromGX';
import { Lurantis } from './SMP_25_Lurantis';
import { TapuKoko } from './tapu-koko';

export class LurantisArt extends Lurantis {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SMP/SMP_025_R_EN_LG.png';
}

export class PalaceBookArt extends PalaceBook {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpc/SMP/SMP_NAN25_R_JP_LG.png';
}

export class PikachuZekromGXArt extends PikachuZekromGX {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SMP/SMP_168_R_EN_LG.png';
}

export class TapuKokoArt extends TapuKoko {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SMP/SMP_030_R_EN_LG.png';
}