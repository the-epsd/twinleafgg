import { Quagsire } from '../set-dragons-majesty/quagsire';
import { Wooper } from '../set-dragons-majesty/wooper';
import { Charmander } from './charmander';
import { ErikasHospitality } from './erikas-hospitality';
import { Psyduck } from './HIF_11_Psyduck';

export class CharmanderArt extends Charmander {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_007_R_EN.png';
}

export class ErikasHospitalityArt extends ErikasHospitality {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_056_R_EN_LG.png';
}

export class PsyduckArt extends Psyduck {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_011_R_EN_LG.png';
}

export class WooperArt extends Wooper {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_SV9_R_EN_LG.png';
  public fullName = 'Wooper HIF';
  public set = 'HIF';
  public setNumber = 'SV9';
}

export class QuagsireArt extends Quagsire {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_SV10_R_EN_LG.png';
  public fullName = 'Quagsire HIF';
  public set = 'HIF';
  public setNumber = 'SV10';
}