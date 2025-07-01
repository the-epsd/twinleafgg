import { Card } from '../../game/store/card/card';
import { BebesSearch } from './bebes-search';
import { Croconaw } from './croconaw';
import { UnownE } from './unown-e';
import { TimeSpaceDistortion } from './time-space-distortion';
import { Totodile } from './totodile';

// Other prints
import {
  MultiEnergyMT,
  NightMaintenanceMT
} from './other-prints';

export const setMysteriousTreasures: Card[] = [
  new BebesSearch(),
  new Croconaw(),
  new UnownE(),
  new TimeSpaceDistortion(),
  new Totodile(),

  // Other prints
  new MultiEnergyMT(),
  new NightMaintenanceMT()
];
