import { Card } from '../../game/store/card/card';
import { FloatzelGL } from './floatzel-gl';
import { FloatzelGLLVX } from './floatzel-gl-lv-x';
import { Jirachi } from './jirachi';
import { LuxrayGL } from './luxray-gl';
import { LuxrayGLLVX } from './luxray-gl-lv-x';
import { PokemonContestHall } from './pokemon-contest-hall';

export const setRisingRivals: Card[] = [
  new Jirachi(),
  new LuxrayGL(),
  new LuxrayGLLVX(),
  new FloatzelGL(),
  new FloatzelGLLVX(),
  new PokemonContestHall(),
];