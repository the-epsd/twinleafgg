import { Lapras } from './lapras';
import { PokemonCommunication } from './pokemon-communication';
import { ViridianForest } from './viridian-forest';
import { Zapdos } from './zapdos';

export class LaprasArt extends Lapras {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_031_R_EN.png';
}

export class PokemonCommunicationArt extends PokemonCommunication {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_152_R_EN.png';
}

export class ViridianForestArt extends ViridianForest {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_156_R_EN.png';
}

export class ZapdosArt extends Zapdos {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_040_R_EN.png';
}