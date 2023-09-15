import { Card } from '../../game/store/card/card';
import { Gallade } from './gallade';
import { Irida } from './irida';
import { OriginFormePalkiaV } from './origin-forme-palkia-v';
import { OriginFormePalkiaVSTAR } from './origin-forme-palkia-vstar';
import { RadiantGreninja } from './radiant-greninja';
import { Ralts } from './ralts';

export const setAstralRadiance: Card[] = [
  new Irida(),
  new Ralts(),
  new Gallade(),
  new RadiantGreninja(),
  new OriginFormePalkiaVSTAR(),
  new OriginFormePalkiaV(),
];
