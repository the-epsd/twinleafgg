import { Card } from '../../game/store/card/card';
import { BebesSearch } from './bebes-search';
import { Chansey } from './chansey';
import { Croconaw } from './croconaw';
import { UnownE } from './unown-e';
import { TeamGalacticsWager } from './team-galactics-wager';
import { TimeSpaceDistortion } from './time-space-distortion';
import { Totodile } from './totodile';

// Other prints
import {
  MultiEnergyMT,
  NightMaintenanceMT
} from './other-prints';

export const setMysteriousTreasures: Card[] = [
  new BebesSearch(),
  new Chansey(),
  new Croconaw(),
  new UnownE(),
  new TeamGalacticsWager(),
  new TimeSpaceDistortion(),
  new Totodile(),

  // Other prints
  new MultiEnergyMT(),
  new NightMaintenanceMT()
];
