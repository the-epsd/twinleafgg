import { Card } from '../../game/store/card/card';
import { CrobatG } from './crobat-g';
import { PokeTurn } from './poke-turn';
import { PokemonRescue } from './pokemon-rescue';

export const setPlatinum: Card[] = [

  new CrobatG(),
  new PokeTurn(),
  new PokemonRescue(),
];
