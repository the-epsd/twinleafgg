import { UltraBall } from '../set-scarlet-and-violet/ultra-ball';
import { MasterBall } from '../set-temporal-forces/master-ball';
import { ScoopUpCyclone } from '../set-twilight-masquerade/scoop-up-cyclone';
import { JirachiEx } from './jirachi-ex';
import { SilverBangle } from './silver-bangle';
import { VirizionEx } from './virizion-ex';
import { Wartortle } from './wartortle';

export class JirachiExArt extends JirachiEx {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_060_R_EN.png';
}

export class ScoopUpCycloneArt extends ScoopUpCyclone {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_095_R_EN.png';
  public setNumber = '95';
  public fullName: string = 'Scoop Up Cyclone PLB';
}

export class SilverBangleArt extends SilverBangle {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_088_R_EN.png';
}

export class UltraBallArt extends UltraBall {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_090_R_EN.png';
  public setNumber = '90';
  public fullName: string = 'Ultra ball PLB';
}

export class VirizionExArt extends VirizionEx {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_009_R_EN.png';
}

export class MasterBallArt extends MasterBall {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_094_R_EN_LG.png';
  public setNumber = '94';
  public fullName: string = 'Master Ball PLB';
}

export class WartortleArt extends Wartortle {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_015_R_EN_LG.png';
}