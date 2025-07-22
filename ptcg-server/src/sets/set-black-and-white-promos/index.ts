import { Card } from '../../game/store/card/card';
import { Kyurem } from './kyurem';
import { Litwick } from './litwick';
import { TropicalBeach } from './tropical-beach';

// Other Prints
import {
  KeldeoExBWP,
  TropicalBeach2
} from './other-prints';

export const setBlackAndWhitePromos: Card[] = [
  new Kyurem(),
  new Litwick(),
  new TropicalBeach(),

  // Other Prints
  new KeldeoExBWP(),
  new TropicalBeach2(),
];
