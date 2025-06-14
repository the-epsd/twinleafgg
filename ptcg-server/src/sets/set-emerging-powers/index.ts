import { Card } from '../../game/store/card/card';
import { Bianca } from './bianca';
import { CrushingHammerEPO, RecycleEPO } from './other-prints';
import { Cheren } from './cheren';
import { MaxPotion } from './max-potion';
import { Tornadus } from './tornadus';
import { PokemonCatcher } from './pokemon-catcher';

export const setEmergingPowers: Card[] = [
  new Bianca(),
  new Cheren(),
  new CrushingHammerEPO(),
  new MaxPotion(),
  new RecycleEPO(),
  new PokemonCatcher(),
  new Tornadus(),
];
