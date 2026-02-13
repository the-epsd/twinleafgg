import { Card } from '../../game/store/card/card';
import { Axew } from './axew';
import { Axew2 } from './axew-2';
import { Bagon } from './bagon';
import { Dragonair } from './dragonair';
import { Dragonair2 } from './dragonair-2';
import { Dragonite } from './dragonite';
import { Dratini } from './dratini';
import { Dratini2 } from './dratini-2';
import { Druddigon } from './druddigon';
import { Fraxure } from './fraxure';
import { Fraxure2 } from './fraxure-2';
import { Haxorus } from './haxorus';
import { Kyurem } from './kyurem';
import { Latias } from './latias';
import { Latios } from './latios';
import { Rayquaza } from './rayquaza';
import { Salamence } from './salamence';
import { FirstTicket } from './first-ticket';

import {
  ExpShareDRV,
  SuperRodDRV,
  ShelgonDRV,
} from './other-prints';

export const setDragonVault: Card[] = [
  // Pokemon
  new Axew(),
  new Axew2(),
  new Bagon(),
  new Dragonair(),
  new Dragonair2(),
  new Dragonite(),
  new Dratini(),
  new Dratini2(),
  new Druddigon(),
  new Fraxure(),
  new Fraxure2(),
  new Haxorus(),
  new Kyurem(),
  new Latias(),
  new Latios(),
  new Rayquaza(),
  new Salamence(),

  // Trainers
  new FirstTicket(),

  // Other Prints (Reprints & Alt Arts)
  new ExpShareDRV(),
  new SuperRodDRV(),
  new ShelgonDRV(),
];
