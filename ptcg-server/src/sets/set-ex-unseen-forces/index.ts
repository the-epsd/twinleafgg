import { Card } from '../../game';
import { MarysRequest } from './marys-request';
import { PokemonReversal } from './pokemon-reversal';
import { Stantler } from './stantler';
import { Slowpoke } from './slowpoke';
import { Teddiursa } from './teddiursa';
import { Typhlosionex } from './typhlosion-ex';
import { Ursaring } from './ursaring';

// Other prints
import { WarpEnergyUF } from './other-prints';

export const setEXUnseenForces: Card[] = [
  new MarysRequest(),
  new PokemonReversal(),
  new Stantler(),
  new Slowpoke(),
  new Teddiursa(),
  new Typhlosionex(),
  new Ursaring(),

  // Other prints
  new WarpEnergyUF(),
];