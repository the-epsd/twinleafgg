import { Card } from '../../game/store/card/card';
import { SnorlaxIR } from './alt-arts';
import { Ampharosex } from './ampharos-ex';
import { Charmander } from './charmander';
import { Mimikyuex } from './mimikyu-ex';
import { Pecharunt } from './pecharunt';
import { Tinkatonex } from './tinkaton-ex';
import { TMMachine } from './tm-machine';


export const setScarletAndVioletPromos: Card[] = [
  new Ampharosex(),
  new Charmander(),
  new Mimikyuex(),
  new Pecharunt(),
  new Tinkatonex(),
  new TMMachine(),

  // Alt arts
  new SnorlaxIR(),
];