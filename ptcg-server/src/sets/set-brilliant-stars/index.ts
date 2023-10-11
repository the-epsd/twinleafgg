import { Card } from '../../game/store/card/card';
import { ArceusV } from './arceus-v';
import { ArceusVSTAR } from './arceus-vstar';
import { Bibarel } from './bibarel';
import { CherensCare } from './cherens-care';
import { CollapsedStadium } from './collapsed-stadium';
import { DoubleTurboEnergy } from './double-turbo-energy';
import { EnteiV } from './entei-v';
import { LumineonV } from './lumineon-v';
import { Manaphy } from './manaphy';
import { RaichuV } from './raichu-v';
import { RaikouV } from './raikou-v';

export const setBrilliantStars: Card[] = [
  new CollapsedStadium(),
  new Manaphy(),
  new Bibarel(),
  new ArceusV(),
  new ArceusVSTAR(),
  new DoubleTurboEnergy(),
  new RaikouV(),
  new LumineonV(),
  new RaichuV(),
  new CherensCare(),
  new EnteiV(),
];
