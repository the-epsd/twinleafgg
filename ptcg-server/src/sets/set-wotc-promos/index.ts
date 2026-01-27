import { Card } from '../../game/store/card/card';
import { ComputerError } from './computer-error';
import { Mew } from './mew';
import { Mewtwo } from './mewtwo';
import { PokemonTower } from './pokemon-tower';
import { Snorlax } from './snorlax';

// Other prints
import {
  MewtwoPR,
  PsyduckPR,
} from './other-prints';

export const setWOTCPromos: Card[] = [
  new ComputerError(),
  new Mew(),
  new Mewtwo(),
  new PokemonTower(),
  new Snorlax(),

  // Other prints
  new MewtwoPR(),
  new PsyduckPR(),
];