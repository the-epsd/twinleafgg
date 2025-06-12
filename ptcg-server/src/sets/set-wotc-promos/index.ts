import { Card } from '../../game/store/card/card';
import { ComputerError } from './computer-error';
import { Mew } from './mew';
import { Mewtwo } from './mewtwo';
import { Snorlax } from './snorlax';

export const setWOTCPromos: Card[] = [
  new ComputerError(),
  new Mew(),
  new Mewtwo(),
  new Snorlax(),
];