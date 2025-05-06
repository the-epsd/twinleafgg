import { Card } from '../../game/store/card/card';
import { AlolanMuk } from './alolan-muk';
import { Articuno } from './articuno';
import { Beedrill } from './beedrill';
import { BillsAnalysis } from './bills-analysis';
import { Bisharp } from './bisharp';
import { Bronzor } from './bronzor';
import { CelebiVenusaurGX } from './celebi-and-venusaur-gx';
import { Charizard } from './charizard';
import { Charmander } from './charmander';
import { Charmeleon } from './charmeleon';
import { Dragonite } from './dragonite';
import { EeveeSnorlaxGX } from './eevee-and-snorlax-gx';
import { Ferrothorn } from './ferrothorn';
import { Galvantula } from './glavantula';
import { GengarMimikyuGX } from './gengar-and-mimikyu-gx';
import { Hitmonchan } from './hitmonchan';
import { Hitmonlee } from './hitmonlee';
import { Jasmine } from './jasmine';
import { Jirachi } from './jirachi';
import { Joltik } from './joltik';
import { JudgeWhistle } from './judge-whistle';
import { Kakuna } from './kakuna';
import { Lapras } from './lapras';
import { MagikarpWailordGX } from './magikarp-and-wailord-gx';
import { Mareep } from './mareep';
import { MetalGoggles } from './metal-goggles';
import { Mimikyu } from './mimikyu';
import { Moltres } from './moltres';
import { Pawniard } from './pawniard';
import { Persian } from './persian';
import { Pidgeotto } from './pidgeotto';
import { PokemonCommunication } from './pokemon-communication';
import { ShayminPrismStar } from './shaymin-prism-star';
import { TapuKokoPrismStar } from './tapu-koko-prism-star';
import { ViridianForest } from './viridian-forest';
import { Weedle } from './weedle';
import { Weedle2 } from './weedle-2';
import { Yveltal } from './yveltal';
import { Zapdos } from './zapdos';

export const setTeamUp: Card[] = [
  // new Absol(), something weird is going on with checking retreat cost and adding retreat cost; attack works though
  new AlolanMuk(),
  new Articuno(),
  new Beedrill(),
  new BillsAnalysis(),
  new Bisharp(),
  new Bronzor(),
  new Charizard(),
  new Charmander(),
  new Charmeleon(),
  new Dragonite(),
  new Ferrothorn(),
  new Galvantula(),
  new GengarMimikyuGX(),
  new Hitmonchan(),
  new Hitmonlee(),
  new Jasmine(),
  new Jirachi(),
  new Joltik(),
  new Kakuna(),
  new Lapras(),
  new Mareep(),
  new MetalGoggles(),
  new Mimikyu(),
  new Moltres(),
  new Pawniard(),
  new Persian(),
  new Pidgeotto(),
  new PokemonCommunication(),
  new ShayminPrismStar(),
  new TapuKokoPrismStar(),
  new ViridianForest(),
  new Weedle(),
  new Weedle2(),
  new Yveltal(),
  new Zapdos(),
  new JudgeWhistle(),
  new EeveeSnorlaxGX(),
  new MagikarpWailordGX(),
  new CelebiVenusaurGX(),
];
