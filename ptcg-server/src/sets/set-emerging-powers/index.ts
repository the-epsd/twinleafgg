import { Card } from '../../game/store/card/card';
import { Bianca } from './bianca';
import { Cheren } from './cheren';
import { CrushingHammer } from './crushing-hammer';
import { MaxPotion } from './max-potion';
import { Tornadus } from './tornadus';

export const setEmergingPowers: Card[] = [
  new Bianca(),
  new Cheren(),
  new CrushingHammer(),
  new MaxPotion(),
  new Tornadus(),
];
