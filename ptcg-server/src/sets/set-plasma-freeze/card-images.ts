import { SuperiorEnergyRetrieval } from '../set-paldea-evolved/superior-energy-retrieval';
import { Exeggcute } from './exeggcute';
import { FloatStone } from './float-stone';
import { MrMime } from './mr-mime';
import { RockGuard } from './rock-guard';

export class ExeggcuteArt extends Exeggcute {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_004_R_EN.png';
}

export class FloatStoneArt extends FloatStone {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_099_R_EN.png';
}

export class MrMimeArt extends MrMime {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_047_R_EN.png';
}

export class RockGuardArt extends RockGuard {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_108_R_EN.png';
}

export class SuperiorEnergyRetrievalArt extends SuperiorEnergyRetrieval {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_103_R_EN.png';
  public setNumber = '103';
  public fullName: string = 'Superior Energy Retrieval PLF';
}