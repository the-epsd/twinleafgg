import { Card } from '../../game/store/card/card';
import { HolonAdventurer } from './holon-adventurer';
import { HolonsCastform } from './holons-castform';
import { Meowth } from './meowth';
import { Oddish } from './oddish';
import { Pidgey } from './pidgey';
import { Pikachu } from './pikachu';
import { Raichu } from './raichu';

export const setEXHolonPhantoms: Card[] = [
  new HolonAdventurer(),
  new Meowth(),
  new Oddish(),
  new Pidgey(),
  new Pikachu(),
  new Raichu(),
  new HolonsCastform(),
];
