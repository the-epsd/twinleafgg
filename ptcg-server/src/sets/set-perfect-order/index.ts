import { Card } from '../../game/store/card/card';
import { Barbaracle } from './barbaracle';
import { Binacle } from './binacle';
import { CoreMemory } from './core-memory';
import { LumioiseCity } from './lumioise-city';
import { MegaSkarmoryex } from './mega-skarmory-ex';
import { MegaZygardeex } from './mega-zygarde-ex';
import { Meowthex } from './meowth-ex';
import { Naveen } from './naveen';
import { RockFightingEnergy } from './rock-fighting-energy';
import { Tarragon } from './tarragon';

export const setPerfectOrder: Card[] = [
  new Barbaracle(),
  new Binacle,
  new CoreMemory(),
  new LumioiseCity(),
  new MegaSkarmoryex(),
  new MegaZygardeex(),
  new Meowthex(),
  new Naveen(),
  new RockFightingEnergy(),
  new Tarragon(),
];
