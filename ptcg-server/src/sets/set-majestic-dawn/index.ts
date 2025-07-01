import { Card } from '../../game/store/card/card';
import { Bronzong } from './bronzong';
import { Bronzor } from './bronzor';
import { CallEnergy } from './call-energy';
import { Chatot } from './chatot';
import { Empoleon } from './empoleon';
import { Prinplup } from './prinplup';
import { QuickBall } from './quick-ball';
import { UnownP } from './unown-p';
import { UnownQ } from './unown-q';

// Other prints
import { WarpPointMD } from './other-prints';

export const setMajesticDawn: Card[] = [
  new Bronzong(),
  new Bronzor(),
  new CallEnergy(),
  new Chatot(),
  new Empoleon(),
  new Prinplup(),
  new QuickBall(),
  new UnownP(),
  new UnownQ(),

  // Other prints
  new WarpPointMD()
];
