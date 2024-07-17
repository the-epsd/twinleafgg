import { Applin } from './SHF_SV12_Applin';
import { Snom } from './snom';

export class ApplinArt extends Applin {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_SV12_R_EN_LG.png';
}

export class SnomSVArt extends Snom {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_SV33_R_EN_LG.png';
  public setNumber = 'SV33';
}