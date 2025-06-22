import { Card } from '../../game/store/card/card';
import { CallEnergy } from './call-energy';
import { QuickBall } from './quick-ball';
import { UnownP } from './unown-p';
import { UnownQ } from './unown-q';

export const setMajesticDawn: Card[] = [
  new CallEnergy(),
  new UnownP(),
  new UnownQ(),
  new QuickBall(),
];
