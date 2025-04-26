import { Card } from '../../game/store/card/card';
import { CrobatG } from './crobat-g';
import { Delcatty } from './delcatty';
import { PokeTurn } from './poke-turn';
import { PokemonRescue } from './pokemon-rescue';
import { Skitty } from './skitty';
import { SkuntankG } from './skuntank-g';
import { Ralts } from './ralts';
import {Giratina} from './giratina';
import {GiratinaLVX} from './giratina-lv-x';
import {PalkiaG} from './palkia-g';
import {PalkiaGLVX} from './palkia-g-lv-x';

export const setPlatinum: Card[] = [
  new SkuntankG(),
  new CrobatG(),
  new Delcatty(),
  new PokeTurn(),
  new PokemonRescue(),
  new Ralts(),
  new Skitty(),
  new Giratina(),
  new GiratinaLVX(),
  new PalkiaG(),
  new PalkiaGLVX(),
];
