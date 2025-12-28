import { DuskBallMT, QuickBallMT, DarknessEnergySpecialMT, MetalEnergyN1MT } from './other-prints';
import { Card } from '../../game/store/card/card';
import { Azelf } from './azelf';
import { BebesSearch } from './bebes-search';
import { Chansey } from './chansey';
import { Croconaw } from './croconaw';
import { Gabite } from './gabite';
import { Garchomp } from './garchomp';
import { Mesprit } from './mesprit';
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
  new Azelf(),
  new BebesSearch(),
  new Chansey(),
  new Croconaw(),
  new Gabite(),
  new Garchomp(),
  new Mesprit(),
  new UnownE(),
  new TeamGalacticsWager(),
  new TimeSpaceDistortion(),
  new Totodile(),

  // Other prints
  new MultiEnergyMT(),
  new NightMaintenanceMT(),
  new DuskBallMT(),
  new QuickBallMT(),
  new DarknessEnergySpecialMT(),
  new MetalEnergyN1MT(),
];
