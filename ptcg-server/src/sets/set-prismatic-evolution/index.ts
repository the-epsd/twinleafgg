import { Card } from '../../game/store/card/card';
import { Eeveeex } from './eevee-ex';
import { Espeonex } from './espeon-ex';
import { Flareonex } from './flareon-ex';
import { Glaceonex } from './glaceon-ex';
import { Jolteonex } from './jolteon-ex';
import { Leafeonex } from './leafeon-ex';
import { MaxRod } from './max-rod';
import { Regigigas } from './regigigas';
import { Seaking } from './seaking';
import { TreasureGadget } from './treasure-gadget';
import { Umbreonex } from './umbreon-ex';
import { Vaporeonex } from './vaporeon-ex';

export const setPrismaticEvolution: Card[] = [
  new Eeveeex(),
  new Jolteonex(),
  new Flareonex(),
  new Vaporeonex(),
  new Espeonex(),
  new Umbreonex(),
  new Leafeonex(),
  new Glaceonex(),
  new Seaking(),
  new Regigigas(),
  new MaxRod(),
  new TreasureGadget(),
];