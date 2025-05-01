import { Card } from '../../game/store/card/card';
import { Gardevoir } from './gardevoir';
import {GardevoirLVX} from './gardevoir-lv-x';
import { Kirlia } from './kirlia';
import { Minun } from './minun';
import { Plusle } from './plusle';
import { Ralts } from './ralts';
import { RoseannesResearch } from './roseannes-research';

export const setSecretWonders: Card[] = [
  new Minun(),
  new Plusle(),
  new Ralts(),
  new Kirlia(),
  new Gardevoir(), 
  new RoseannesResearch(),
  new GardevoirLVX()
];