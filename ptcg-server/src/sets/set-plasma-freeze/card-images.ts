import { SuperiorEnergyRetrieval } from '../set-paldea-evolved/superior-energy-retrieval';
import { Exeggcute } from './exeggcute';
import { FloatStone } from './float-stone';
import { FrozenCity } from './frozen-city';
import { MrMime } from './mr-mime';
import { Electrode } from './electrode';
import { Exeggutor } from './exeggutor';
import { RockGuard } from './rock-guard';

export class ElectrodeArt extends Electrode {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_033_R_EN_LG.png';
}

export class ExeggcuteArt extends Exeggcute {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_004_R_EN.png';
}

export class ExeggutorArt extends Exeggutor {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_005_R_EN.png';
}

export class FloatStoneArt extends FloatStone {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_099_R_EN.png';
}

export class FrozenCityArt extends FrozenCity {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_100_R_EN.png';
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