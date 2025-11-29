import { PikachuZekromGXTEU, ErikasHospitalityTEU, UnidentifiedFossilTEU, CelebiVenusaurGX2TEU, MagikarpWailordGX2TEU, PikachuZekromGX2TEU, GengarMimikyuGX2TEU, GengarMimikyuGX3TEU, CobalionGX2TEU, EeveeSnorlaxGX2TEU, BrocksGrit2TEU, ErikasHospitality2TEU, IngoAndEmmet2TEU, Jasmine2TEU, CelebiVenusaurGX3TEU, MagikarpWailordGX3TEU, PikachuZekromGX3TEU, GengarMimikyuGX4TEU, CobalionGX3TEU, EeveeSnorlaxGX3TEU, DangerousDrill2TEU, JudgeWhistle2TEU, MetalGoggles2TEU, PokemonCommunicationHS4TEU, PokemonCommunicationHS2TEU, PokemonCommunicationHS3TEU, GrassEnergyTEU, FireEnergyTEU, WaterEnergyTEU, LightningEnergyTEU, PsychicEnergyTEU, FightingEnergyTEU, DarknessEnergyTEU, MetalEnergyTEU, FairyEnergyTEU } from './other-prints';
import { Card } from '../../game/store/card/card';
import { AlolanMuk } from './alolan-muk';
import { Articuno } from './articuno';
import { Beedrill } from './beedrill';
import { BillsAnalysis } from './bills-analysis';
import { Bisharp } from './bisharp';
import { BlackMarketPrismStar } from './black-market-prism-star';
import { Bronzor } from './bronzor';
import { BuffPadding } from './buff-padding';
import { CelebiVenusaurGX } from './celebi-and-venusaur-gx';
import { Charizard } from './charizard';
import { Charmander } from './charmander';
import { Charmeleon } from './charmeleon';
import { CobalionGX } from './cobalion-gx';
import { DangerousDrill } from './dangerous-drill';
import { Dragonite } from './dragonite';
import { Dratini } from './dratini';
import { EeveeSnorlaxGX } from './eevee-and-snorlax-gx';
import { Ferrothorn } from './ferrothorn';
import { Galvantula } from './glavantula';
import { GengarMimikyuGX } from './gengar-and-mimikyu-gx';
import { Hitmonchan } from './hitmonchan';
import { Hitmonlee } from './hitmonlee';
import { IngoAndEmmet } from './ingo-and-emmet';
import { Jasmine } from './jasmine';
import { Jirachi } from './jirachi';
import { Joltik } from './joltik';
import { JudgeWhistle } from './judge-whistle';
import { Kakuna } from './kakuna';
import { Lapras } from './lapras';
import { LavenderTown } from './lavender-town';
import { MagikarpWailordGX } from './magikarp-and-wailord-gx';
import { Mareep } from './mareep';
import { MetalGoggles } from './metal-goggles';
import { Mimikyu } from './mimikyu';
import { Moltres } from './moltres';
import { Ninetales } from './ninetales';
import { Poochyena } from './poochyena';
import { Ponyta } from './ponyta';
import { Pawniard } from './pawniard';
import { Persian } from './persian';
import { Pidgeotto } from './pidgeotto';
import { PokemonCommunication } from './pokemon-communication';
import { ShayminPrismStar } from './shaymin-prism-star';
import { TapuKokoPrismStar } from './tapu-koko-prism-star';
import { ViridianForest } from './viridian-forest';
import { Weedle } from './weedle';
import { Weedle2 } from './weedle-2';
import { WondrousLabyrinthPrismStar } from './wondrous-labyrinth-prism-star';
import { Yveltal } from './yveltal';
import { Zapdos } from './zapdos';
import { Pidgey } from './pidgey';
import { Pidgeot } from './pidgeot';
import { BrocksGritTEU } from './other-prints';
import { Charmander2 } from './charmander-2';
import { Rapidash } from './rapidash';
import { NidoranFemale } from './nidoran-female';
import { Nidoqueen } from './nidoqueen';
import { Nidorina } from './nidorina';
import { Farfetchd } from './farfetchd';

export const setTeamUp: Card[] = [
  // new Absol(), something weird is going on with checking retreat cost and adding retreat cost; attack works though
  new AlolanMuk(),
  new Articuno(),
  new Beedrill(),
  new BillsAnalysis(),
  new Bisharp(),
  new BlackMarketPrismStar(),
  new Bronzor(),
  new BuffPadding(),
  new Charizard(),
  new Charmander(),
  new Charmander2(),
  new Charmeleon(),
  new CobalionGX(),
  new DangerousDrill(),
  new Dragonite(),
  new Dratini(),
  new Ferrothorn(),
  new Galvantula(),
  new GengarMimikyuGX(),
  new Hitmonchan(),
  new Hitmonlee(),
  new IngoAndEmmet(),
  new Jasmine(),
  new Jirachi(),
  new Joltik(),
  new Kakuna(),
  new Lapras(),
  new LavenderTown(),
  new Mareep(),
  new MetalGoggles(),
  new Mimikyu(),
  new Moltres(),
  new Ninetales(),
  new Poochyena(),
  new Ponyta(),
  new Pawniard(),
  new Persian(),
  new Pidgeot(),
  new Pidgeotto(),
  new Pidgey(),
  new PokemonCommunication(),
  new Rapidash(),
  new ShayminPrismStar(),
  new TapuKokoPrismStar(),
  new ViridianForest(),
  new Weedle(),
  new Weedle2(),
  new WondrousLabyrinthPrismStar(),
  new Yveltal(),
  new Zapdos(),
  new JudgeWhistle(),
  new EeveeSnorlaxGX(),
  new MagikarpWailordGX(),
  new CelebiVenusaurGX(),
  new Nidoqueen(),
  new Nidorina(),
  new NidoranFemale(),
  new Farfetchd(),

  //Other Prints
  new BrocksGritTEU(),
  new PikachuZekromGXTEU(),
  new ErikasHospitalityTEU(),
  new UnidentifiedFossilTEU(),
  new CelebiVenusaurGX2TEU(),
  new MagikarpWailordGX2TEU(),
  new PikachuZekromGX2TEU(),
  new GengarMimikyuGX2TEU(),
  new GengarMimikyuGX3TEU(),
  new CobalionGX2TEU(),
  new EeveeSnorlaxGX2TEU(),
  new BrocksGrit2TEU(),
  new ErikasHospitality2TEU(),
  new IngoAndEmmet2TEU(),
  new Jasmine2TEU(),
  new CelebiVenusaurGX3TEU(),
  new MagikarpWailordGX3TEU(),
  new PikachuZekromGX3TEU(),
  new GengarMimikyuGX4TEU(),
  new CobalionGX3TEU(),
  new EeveeSnorlaxGX3TEU(),
  new DangerousDrill2TEU(),
  new JudgeWhistle2TEU(),
  new MetalGoggles2TEU(),
  new PokemonCommunicationHS4TEU(),
  new PokemonCommunicationHS2TEU(),
  new PokemonCommunicationHS3TEU(),
  new GrassEnergyTEU(),
  new FireEnergyTEU(),
  new WaterEnergyTEU(),
  new LightningEnergyTEU(),
  new PsychicEnergyTEU(),
  new FightingEnergyTEU(),
  new DarknessEnergyTEU(),
  new MetalEnergyTEU(),
  new FairyEnergyTEU(),
];
