import { EnergyRetrieval } from '../set-scarlet-and-violet/energy-retrieval';
import { ExpShare } from '../set-scarlet-and-violet/exp-share';
import { NestBall } from '../set-scarlet-and-violet/nest-ball';
import { RareCandy } from '../set-scarlet-and-violet/rare-candy';
import { AlolanGrimer } from './alolan-grimer';
import { AlolanMuk } from './alolan-muk';
import { Dragonair } from './dragonair';
import { Herdier } from './herdier';
import { Oranguru } from './oranguru';
import { ProfessorKukui } from './professor-kukui';
import { RainbowEnergy } from './rainbow-energy';
import { Repel } from './repel';
import { Fomantis } from './fomantis';
import { Golduck } from './golduck';
import { AlolanRattata } from './alolan_rattata';
import { TimerBall } from './timer-ball';

export class AlolanGrimerArt extends AlolanGrimer {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_057_R_EN_LG.png';
}

export class AlolanMukArt extends AlolanMuk {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_058_R_EN_LG.png';
}

export class AlolanRattataArt extends AlolanRattata {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_076_R_EN_LG.png';
}

export class DragonairArt extends Dragonair {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_095_R_EN.png';
}

export class EnergyRetrievalArt extends EnergyRetrieval {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_116_R_EN.png';
  public setNumber = '116';
  public fullName: string = 'Energy Retrieval SUM';
}

export class ExpShareArt extends ExpShare {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_118_R_EN.png';
  public setNumber = '118';
  public fullName: string = 'Exp. Share SUM';
}

export class FomantisArt extends Fomantis {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_014_R_EN_LG.png';
}

export class GolduckArt extends Golduck {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_029_R_EN_LG.png';
}

export class HerdierArt extends Herdier {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_104_R_EN.png';
}

export class NestBallArt extends NestBall {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_123_R_EN.png';
  public setNumber = '123';
  public fullName: string = 'Nest Ball SUM';
}

export class OranguruArt extends Oranguru {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_113_R_EN_LG.png';
}

export class ProfessorKukuiArt extends ProfessorKukui {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_128_R_EN.png';
}

export class RainbowEnergyArt extends RainbowEnergy {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_137_R_EN.png';
}

export class RareCandyArt extends RareCandy {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_129_R_EN.png';
  public setNumber = '129';
  public fullName: string = 'Rare Candy SUM';
}

export class RepelArt extends Repel {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_130_R_EN.png';
}

export class TimerBallArt extends TimerBall {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_134_R_EN_LG.png';
}