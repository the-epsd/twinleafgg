import { Card } from '../../game/store/card/card';
import { CallEnergy } from './call-energy';
import { Chatot } from './chatot';
import { QuickBall } from './quick-ball';
import { UnownP } from './unown-p';
import { UnownQ } from './unown-q';

// Other prints
import { WarpPointMD } from './other-prints';

export const setMajesticDawn: Card[] = [
  new CallEnergy(),
  new Chatot(),
  new UnownP(),
  new UnownQ(),
  new QuickBall(),

  // Other prints
  new WarpPointMD()
];
