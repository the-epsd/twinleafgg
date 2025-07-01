import { Card } from '../../game/store/card/card';
import { Brigette } from './brigette';
import { BuddyBuddyRescue } from './buddy-buddy-rescue';
import { Florges } from './florges';
import { Gengar } from './gengar';
import { Haunter } from './haunter';
import { Magnemite } from './magnemite';
import { Magneton } from './magneton';
import { MrMime } from './mr-mime';
import { Octillery } from './octillery';
import { ParallelCity } from './parallel-city';
import { TownMap } from './town-map';
import { BurningEnergy } from './burning-energy';

export const setBreakthrough: Card[] = [
  new Brigette(),
  new BurningEnergy(),
  new BuddyBuddyRescue(),
  new Magneton(),
  new Florges(),
  new Gengar(),
  new Haunter(),
  new Magnemite(),
  new MrMime(),
  new TownMap(),
  new Octillery(),
  new ParallelCity()
];
