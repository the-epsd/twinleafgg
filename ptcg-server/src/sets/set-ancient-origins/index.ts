import { EnergyRecyclerAOR, LuckyHelmetAOR, LysandreAOR, HoopaEX2AOR, GiratinaEX2AOR, EnergyRetrievalAOR, HexManiac2AOR } from './other-prints';
import { Card } from '../../game/store/card/card';
import { AceTrainer } from './ace-trainer';
import { Ariados } from './ariados';
import { Baltoy } from './baltoy';
import { Combee } from './combee';
import { Cottonee } from './cottonee';
import { EcoArm } from './eco-arm';
import { Eevee } from './eevee';
import { FadedTown } from './faded-town';
import { Flareon } from './flareon';
import { GiratinaEX } from './giratina-ex';
import { HexManiac } from './hex-maniac';
import { HoopaEX } from './hoopa-ex';
import { Jolteon } from './jolteon';
import { Unown } from './unown';
import { Vaporeon } from './vaporeon';
import { Vespiquen } from './vespiquen';
import { Vileplume } from './vileplume';

// Other Prints
import { LevelBallAOR } from './other-prints';
import { TrainersMailAOR } from './other-prints';

export const setAncientOrigins: Card[] = [
  new AceTrainer(),
  new Ariados(),
  new Baltoy(),
  new Cottonee(),
  new EcoArm(),
  new Eevee(),
  new FadedTown(),
  new Flareon(),
  new GiratinaEX(),
  new HexManiac(),
  new HoopaEX(),
  new Jolteon(),
  new Unown(),
  new Vaporeon(),
  new Vileplume(),
  new Combee(),
  new Vespiquen(),

  // Other Prints
  new LevelBallAOR(),
  new TrainersMailAOR(),
  new EnergyRecyclerAOR(),
  new LuckyHelmetAOR(),
  new LysandreAOR(),
  new HoopaEX2AOR(),
  new GiratinaEX2AOR(),
  new EnergyRetrievalAOR(),
  new HexManiac2AOR(),
];