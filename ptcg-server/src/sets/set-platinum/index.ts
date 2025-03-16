import { Card } from '../../game/store/card/card';
import { CrobatG } from './crobat-g';
import { PokeTurn } from './poke-turn';
import { PokemonRescue } from './pokemon-rescue';
import { SkuntankG } from './skuntank-g';

export const setPlatinum: Card[] = [
  new SkuntankG(),
  new CrobatG(),
  new PokeTurn(),
  new PokemonRescue(),
];
