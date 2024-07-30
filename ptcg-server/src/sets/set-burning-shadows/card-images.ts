import { Acerola } from './acerola';
import { Marill } from './BUS_34_Marill';
import { DarkraiGX } from './darkrai-gx';
import { Guzma } from './guzma';
import { WishfulBaton } from './wishful-baton';

export class AcerolaArt extends Acerola {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_112_R_EN_LG.png';
}

export class DarkraiGXArt extends DarkraiGX {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_088_R_EN.png';
}

export class GuzmaArt extends Guzma {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_115_R_EN_LG.png';
}

export class MarillArt extends Marill {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_034_R_EN_LG.png';
}

export class WishfulBatonArt extends WishfulBaton {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_128_R_EN_LG.png';
}