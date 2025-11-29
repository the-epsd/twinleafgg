import { JirachiUL, CheerleadersCheerUL, PlusPowerUL } from './other-prints';
import { Card } from '../../game/store/card/card';
import { Crobat } from './crobat-prime';
import { DualBall } from './dual-ball';
import { Golbat } from './golbat';
import { Horsea } from './horsea';
import { Kingdra } from './kingdra';
import { PokemonCirculator } from './pokemon-circulator';
import { Seadra } from './seadra';
import { Shaymin } from './shaymin';
import { Zubat } from './zubat';

// Other prints
import {
  JudgeUL,
  RareCandyUL,
  SuperScoopUpUL
} from './other-prints';

export const setUnleashed: Card[] = [
  new Crobat(),
  new DualBall(),
  new Golbat(),
  new Horsea(),
  new Kingdra(),
  new PokemonCirculator(),
  new Seadra(),
  new Shaymin(),
  new Zubat(),

  // Other prints
  new JudgeUL(),
  new RareCandyUL(),
  new SuperScoopUpUL(),
  new JirachiUL(),
  new CheerleadersCheerUL(),
  new PlusPowerUL(),
];
