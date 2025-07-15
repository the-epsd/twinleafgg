import { Card } from '../../game/store/card/card';
import { Combee } from './combee';
import { Gastly } from './gastly';
import { Gengar } from './gengar';
import { Gyarados } from './gyarados';
import { Haunter } from './haunter';
import { LuxuryBall } from './luxury-ball';
import { Machoke } from './machoke';
import { Machamp } from './machamp';
import { MachampLVX } from './machamp-lv-x';
import { Machop } from './machop';
import { Magikarp } from './magikarp';
import { MarleysRequest } from './marleys-request';
import { PokeBlower } from './poke-blower';
import { PokeDrawer } from './poke-drawer';
import { Sableye } from './sableye';

// Other prints
import {
  CycloneEnergySF,
  PremierBallSF,
  WarpEnergySF
} from './other-prints';

export const setStormfront: Card[] = [
  new Combee(),
  new Gengar(),
  new Gyarados(),
  new Haunter(),
  new LuxuryBall(),
  new Machoke(),
  new Machamp(),
  new MachampLVX(),
  new Machop(),
  new Magikarp(),
  new MarleysRequest(),
  new PokeBlower(),
  new PokeDrawer(),
  new Sableye(),
  new Gastly(),

  // Other prints
  new CycloneEnergySF(),
  new PremierBallSF(),
  new WarpEnergySF()
];
