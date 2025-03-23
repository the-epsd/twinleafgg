import { Card } from '../../game/store/card/card';
import {HolonsCastform} from './holons-castform';
import { Pidgey } from './pidgey';
import { Pikachu } from './pikachu';
import { Raichu } from './raichu';

export const setEXHolonPhantoms: Card[] = [
  new Pidgey(),
  new Pikachu(),
  new Raichu(),
  new HolonsCastform(),
];
