import { Card } from '../../game/store/card/card';
import { DualBall } from './dual-ball';
import { Horsea } from './horsea';
import { Kingdra } from './kingdra';
import { Seadra } from './seadra';
import { Shaymin } from './shaymin';

// Other prints
import {
  JudgeUL,
  RareCandyUL,
  SuperScoopUpUL
} from './other-prints';

export const setUnleashed: Card[] = [
  new DualBall(),
  new Horsea(),
  new Kingdra(),
  new Seadra(),
  new Shaymin(),

  // Other prints
  new JudgeUL(),
  new RareCandyUL(),
  new SuperScoopUpUL()
];
