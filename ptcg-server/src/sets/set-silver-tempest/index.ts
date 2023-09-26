import { Card } from '../../game/store/card/card';
import { Archeops } from './archeops';
import { CapturingAroma } from './capturing-aroma';
import { ForestSealStone } from './forest-seal-stone';
import { Kirlia } from './kirlia';
import { LugiaV } from './lugia-v';
import { LugiaVSTAR } from './lugia-vstar';
import { RadiantAlakazam } from './radiant-alakazam';
import { Worker } from './worker';

export const setSilverTempest: Card[] = [
  new Kirlia(),
  new RadiantAlakazam(),
  new Worker(),
  new ForestSealStone(),
  new LugiaV(),
  new LugiaVSTAR(),
  new Archeops(),
  new CapturingAroma(),
];