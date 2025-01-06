import { Card } from '../../game/store/card/card';
import { Brigette } from './brigette';
import { BuddyBuddyRescue } from './buddy-buddy-rescue';
import { Florges } from './florges';
import { Magneton } from './magneton';
import { MrMime } from './mr-mime';
import { Octillery } from './octillery';
import { ParallelCity } from './parallel-city';
import { TownMap } from './town-map';

export const setBreakthrough: Card[] = [
  new Brigette(),
  new BuddyBuddyRescue(),
  new Magneton(),
  new Florges(),
  new MrMime(),
  new TownMap(),
  new Octillery(),
  new ParallelCity()
];
