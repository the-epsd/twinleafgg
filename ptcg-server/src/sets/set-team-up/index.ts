import { Card } from '../../game/store/card/card';
import { AlolanMuk } from './alolan-muk';
import { Articuno } from './articuno';
import { BeedrillTEU } from './beedrill';
import { BillsAnalysis } from './bills-analysis';
import { Bisharp } from './bisharp';
import { Bronzor } from './bronzor';
import { Dragonite } from './dragonite';
import { Ferrothorn } from './ferrothorn';
import { GengarMimikyuGX } from './gengar-and-mimikyu-gx';
import { Hitmonchan } from './hitmonchan';
import { Hitmonlee } from './hitmonlee';
import { Jirachi } from './jirachi';
import {JudgeWhistle} from './judge-whistle';
import { KakunaTEU } from './kakuna';
import { Lapras } from './lapras';
import { Mareep } from './mareep';
import { MetalGoggles } from './metal-goggles';
import { Mimikyu } from './mimikyu';
import { Moltres } from './moltres';
import { Pawniard } from './pawniard';
import { Persian } from './persian';
import { Pidgeotto } from './pidgeotto';
import { PokemonCommunication } from './pokemon-communication';
import { TapuKokoPrismStar } from './tapu-koko-prism-star';
import { ViridianForest } from './viridian-forest';
import { WeedleTEU } from './weedle';
import { WeedleTEU2 } from './weedle-2';
import { Yveltal } from './yveltal';
import { Zapdos } from './zapdos';



export const setTeamUp: Card[] = [
  // new Absol(), something weird is going on with checking retreat cost and adding retreat cost; attack works though
  new AlolanMuk(),
  new Articuno(),
  new BeedrillTEU(),
  new BillsAnalysis(),
  new Bisharp(),
  new Bronzor(),
  new Dragonite(),
  new Ferrothorn(),
  new GengarMimikyuGX(),
  new Hitmonchan(),
  new Hitmonlee(),
  new Jirachi(),
  new KakunaTEU(),
  new Lapras(),
  new Mareep(),
  new MetalGoggles(),
  new Mimikyu(),
  new Moltres(),
  new Pawniard(),
  new Persian(),
  new Pidgeotto(),
  new PokemonCommunication(),
  new TapuKokoPrismStar(),
  new ViridianForest(),
  new WeedleTEU(),
  new WeedleTEU2(),
  new Yveltal(),
  new Zapdos(),
  new JudgeWhistle(),
];
