import { Card } from '../../game/store/card/card';
import { AmpharosEx } from './ampharos-ex';
import { Ariados } from './ariados';
import { Baltoy } from './baltoy';
import { Baltoy2 } from './baltoy-2';
import { Beldum } from './beldum';
import { Bellossom } from './bellossom';
import { Claydol } from './claydol';
import { Combee } from './combee';
import { Cottonee } from './cottonee';
import { Eevee } from './eevee';
import { Entei } from './entei';
import { Entei2 } from './entei-2';
import { Flareon } from './flareon';
import { Gardevoir } from './gardevoir';
import { GiratinaEX } from './giratina-ex';
import { Gloom } from './gloom';
import { Golett } from './golett';
import { Golurk } from './golurk';
import { Golurk2 } from './golurk-2';
import { Goodra } from './goodra';
import { Goomy } from './goomy';
import { Gyarados } from './gyarados';
import { Gyarados2 } from './gyarados-2';
import { HoopaEX } from './hoopa-ex';
import { Inkay } from './inkay';
import { Jolteon } from './jolteon';
import { Kirlia } from './kirlia';
import { KyuremEx } from './kyurem-ex';
import { Larvesta } from './larvesta';
import { LugiaEx } from './lugia-ex';
import { MAmpharosEx } from './m-ampharos-ex';
import { MSceptileEx } from './m-sceptile-ex';
import { MTyranitarEx } from './m-tyranitar-ex';
import { MachampEx } from './machamp-ex';
import { Magikarp } from './magikarp';
import { Malamar } from './malamar';
import { Meowth } from './meowth';
import { Metagross } from './metagross';
import { Metagross2 } from './metagross-2';
import { Metang } from './metang';
import { Oddish } from './oddish';
import { Persian } from './persian';
import { Porygon } from './porygon';
import { PorygonZ } from './porygon-z';
import { PorygonZ2 } from './porygon-z-2';
import { Porygon2 } from './porygon2';
import { PrimalGroudonEx } from './primal-groudon-ex';
import { Quagsire } from './quagsire';
import { Ralts } from './ralts';
import { Regice } from './regice';
import { Regirock } from './regirock';
import { Registeel } from './registeel';
import { Relicanth } from './relicanth';
import { Rotom } from './rotom';
import { Sableye } from './sableye';
import { SceptileEx } from './sceptile-ex';
import { Sliggoo } from './sliggoo';
import { Spinarak } from './spinarak';
import { TyranitarEx } from './tyranitar-ex';
import { Unown } from './unown';
import { Vaporeon } from './vaporeon';
import { Vespiquen } from './vespiquen';
import { Vespiquen2 } from './vespiquen-2';
import { Vileplume } from './vileplume';
import { Virizion } from './virizion';
import { Volcarona } from './volcarona';
import { Volcarona2 } from './volcarona-2';
import { Whimsicott } from './whimsicott';
import { Wooper } from './wooper';
import { AceTrainer } from './ace-trainer';
import { AmpharosSpiritLink } from './ampharos-spirit-link';
import { EcoArm } from './eco-arm';
import { FadedTown } from './faded-town';
import { ForestOfGiantPlants } from './forest-of-giant-plants';
import { HexManiac } from './hex-maniac';
import { PaintRoller } from './paint-roller';
import { SceptileSpiritLink } from './sceptile-spirit-link';
import { TyranitarSpiritLink } from './tyranitar-spirit-link';
import { DangerousEnergy } from './dangerous-energy';
import { FlashEnergy } from './flash-energy';

import {
  LevelBallAOR,
  TrainersMailAOR,
  EnergyRecyclerAOR,
  LuckyHelmetAOR,
  LysandreAOR,
  HoopaEX2AOR,
  GiratinaEX2AOR,
  EnergyRetrievalAOR,
  HexManiac2AOR,
  LevelBallAOR76,
  SceptileEx2,
  MSceptileEx2,
  KyuremEx2,
  AmpharosEx2,
  MAmpharosEx2,
  MachampEx2,
  TyranitarEx2,
  MTyranitarEx2,
  LugiaEx2,
  StevenAOR,
  PrimalKyogreExAOR,
  MRayquazaExAOR,
  TrainersMailAOR100,
} from './other-prints';

export const setAncientOrigins: Card[] = [
  // Pokemon
  new AmpharosEx(),
  new Ariados(),
  new Baltoy(),
  new Baltoy2(),
  new Beldum(),
  new Bellossom(),
  new Claydol(),
  new Combee(),
  new Cottonee(),
  new Eevee(),
  new Entei(),
  new Entei2(),
  new Flareon(),
  new Gardevoir(),
  new GiratinaEX(),
  new Gloom(),
  new Golett(),
  new Golurk(),
  new Golurk2(),
  new Goodra(),
  new Goomy(),
  new Gyarados(),
  new Gyarados2(),
  new HoopaEX(),
  new Inkay(),
  new Jolteon(),
  new Kirlia(),
  new KyuremEx(),
  new Larvesta(),
  new LugiaEx(),
  new MAmpharosEx(),
  new MSceptileEx(),
  new MTyranitarEx(),
  new MachampEx(),
  new Magikarp(),
  new Malamar(),
  new Meowth(),
  new Metagross(),
  new Metagross2(),
  new Metang(),
  new Oddish(),
  new Persian(),
  new Porygon(),
  new PorygonZ(),
  new PorygonZ2(),
  new Porygon2(),
  new PrimalGroudonEx(),
  new Quagsire(),
  new Ralts(),
  new Regice(),
  new Regirock(),
  new Registeel(),
  new Relicanth(),
  new Rotom(),
  new Sableye(),
  new SceptileEx(),
  new Sliggoo(),
  new Spinarak(),
  new TyranitarEx(),
  new Unown(),
  new Vaporeon(),
  new Vespiquen(),
  new Vespiquen2(),
  new Vileplume(),
  new Virizion(),
  new Volcarona(),
  new Volcarona2(),
  new Whimsicott(),
  new Wooper(),

  // Trainers
  new AceTrainer(),
  new AmpharosSpiritLink(),
  new EcoArm(),
  new FadedTown(),
  new ForestOfGiantPlants(),
  new HexManiac(),
  new PaintRoller(),
  new SceptileSpiritLink(),
  new TyranitarSpiritLink(),

  // Energy
  new DangerousEnergy(),
  new FlashEnergy(),

  // Other Prints (Reprints & Alt Arts)
  new LevelBallAOR(),
  new TrainersMailAOR(),
  new EnergyRecyclerAOR(),
  new LuckyHelmetAOR(),
  new LysandreAOR(),
  new HoopaEX2AOR(),
  new GiratinaEX2AOR(),
  new EnergyRetrievalAOR(),
  new HexManiac2AOR(),
  new LevelBallAOR76(),
  new SceptileEx2(),
  new MSceptileEx2(),
  new KyuremEx2(),
  new AmpharosEx2(),
  new MAmpharosEx2(),
  new MachampEx2(),
  new TyranitarEx2(),
  new MTyranitarEx2(),
  new LugiaEx2(),
  new StevenAOR(),
  new PrimalKyogreExAOR(),
  new MRayquazaExAOR(),
  new TrainersMailAOR100(),
];
