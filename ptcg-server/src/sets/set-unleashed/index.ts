import { Card } from '../../game/store/card/card';
import { DualBall } from './dual-ball';
import { Shaymin } from './shaymin';

// Other prints
import {
  JudgeUL,
  SuperScoopUpUL
} from './other-prints';

export const setUnleashed: Card[] = [
  new DualBall(),
  new Shaymin(),

  // Other prints
  new JudgeUL(),
  new SuperScoopUpUL()
];
