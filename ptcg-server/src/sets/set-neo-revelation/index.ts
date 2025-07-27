import { Card } from '../../game/store/card/card';
import { RocketsHideout } from './rockets-hideout';
import { Zubat } from './zubat';
import { Parasect } from './parasect';

// Other prints
import { BalloonBerryN3 } from './other-prints';

export const setNeoRevelation: Card[] = [
  new RocketsHideout(),
  new Zubat(),
  new Parasect(),

  // Other prints
  new BalloonBerryN3(),
];
