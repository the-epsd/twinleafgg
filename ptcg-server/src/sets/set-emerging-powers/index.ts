import { Card } from '../../game/store/card/card';
import { Bianca } from './bianca';
import { CrushingHammerEPO } from './card-images';
import { Cheren } from './cheren';
import { MaxPotion } from './max-potion';
import { Tornadus } from './tornadus';

export const setEmergingPowers: Card[] = [
  new Bianca(),
  new Cheren(),
  new CrushingHammerEPO(),
  new MaxPotion(),
  new Tornadus(),
];
