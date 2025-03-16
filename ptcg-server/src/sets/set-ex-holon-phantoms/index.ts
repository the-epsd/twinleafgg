import { Card } from '../../game/store/card/card';
import {HolonsCastform} from './holons-castform';
import { Pikachu } from './pikachu';
import { Raichu } from './raichu';

export const setEXHolonPhantoms: Card[] = [
  new Pikachu(),
  new Raichu(),
  new HolonsCastform(),
];
