import { Card } from '../../game/store/card/card';
import { Azelf } from './azelf';
import { Celebi } from './celebi';
import { Greninja } from './greninja';
import { Jirachi } from './jirachi';
import { Karen } from './karen';
import { Meloetta } from './meloetta';
import { Regirock } from './regirock';

// Other Prints
import { BronzongXYP } from './other-prints';

export const setXYPromos: Card[] = [
  new Azelf(),
  new Celebi(),
  new Greninja(),
  new Jirachi(),
  new Karen(),
  new Meloetta(),
  new Regirock(),

  // Other Prints
  new BronzongXYP(),
];