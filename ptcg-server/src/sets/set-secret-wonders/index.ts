import { Card } from '../../game/store/card/card';
import { Gardevoir } from './gardevoir';
import { Kirlia } from './kirlia';
import { Minun } from './minun';
import { Ralts } from './ralts';

export const setSecretWonders: Card[] = [
  new Minun(),
  new Ralts(),
  new Kirlia(),
  new Gardevoir()
];