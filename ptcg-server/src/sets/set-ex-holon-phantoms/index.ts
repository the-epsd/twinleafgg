import { Card } from '../../game/store/card/card';
import { HolonsCastform } from './holons-castform';
import { Oddish } from './oddish';
import { Pikachu } from './pikachu';
import { Raichu } from './raichu';

export const setEXHolonPhantoms: Card[] = [
  new Oddish(),
  new Pikachu(),
  new Raichu(),
  new HolonsCastform(),
];
