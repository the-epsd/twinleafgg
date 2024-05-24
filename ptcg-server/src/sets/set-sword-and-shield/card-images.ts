import { AirBalloon } from './air-balloon';
import { Drizzile } from './drizzile';
import { Inteleon } from './inteleon';
import { QuickBall } from './quick-ball';
import { Snom } from './snom';

export class AirBalloonArt extends AirBalloon {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSH/SSH_156_R_EN_LG.png';
}

export class DrizzileArt extends Drizzile {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSH/SSH_056_R_EN_LG.png';
}

export class InteleonArt extends Inteleon {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSH/SSH_058_R_EN_LG.png';
}

export class SnomArt extends Snom {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSH/SSH_063_R_EN_LG.png';
}

export class QuickBallArt extends QuickBall {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSH/SSH_179_R_EN_LG.png';
}