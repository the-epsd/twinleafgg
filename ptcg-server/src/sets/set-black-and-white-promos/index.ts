import { Card } from '../../game/store/card/card';
import { Kyurem } from './kyurem';
import { Litwick } from './litwick';
import { TropicalBeach } from './tropical-beach';
import { Pikachu } from './pikachu';
import { Minccino } from './minccino';

// Other Prints
import {
  KeldeoExBWP,
  TropicalBeach2
} from './other-prints';

export const setBlackAndWhitePromos: Card[] = [
  new Kyurem(),
  new Litwick(),
  new TropicalBeach(),
  new Pikachu(),
  new Minccino(),

  // Other Prints
  new KeldeoExBWP(),
  new TropicalBeach2(),
];
