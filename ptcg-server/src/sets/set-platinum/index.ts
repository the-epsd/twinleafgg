import { Card } from '../../game/store/card/card';
import { CrobatG } from './crobat-g';
import { Delcatty } from './delcatty';
import { PokeTurn } from './poke-turn';
import { PokemonRescue } from './pokemon-rescue';
import { Skitty } from './skitty';
import { SkuntankG } from './skuntank-g';

export const setPlatinum: Card[] = [
  new SkuntankG(),
  new CrobatG(),
  new Delcatty(),
  new PokeTurn(),
  new PokemonRescue(),
  new Skitty(),
];
