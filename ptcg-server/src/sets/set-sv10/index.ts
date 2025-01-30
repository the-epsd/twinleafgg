import { Card } from '../../game/store/card/card';
import { GraniteCave } from './granite-cave';
import { MarniesGrimmsnarlex } from './marnies-grimmsnarl-ex';
import { MarniesImpidimp } from './marnies-impidimp';
import { MarniesMorgrem } from './marnies-morgrem';
import { MarniesMorpeko } from './marnies-morpeko';
import { SpikemuthGym } from './spikemuth-gym';
import { StevensBeldum } from './stevens-beldum';
import { StevensCarbink } from './stevens-carbink';
import { StevensMetagrossex } from './stevens-metagross-ex';
import { StevensMetang } from './stevens-metang';

export const setSV10: Card[] = [
  new MarniesImpidimp(),
  new MarniesMorgrem(),
  new MarniesGrimmsnarlex(),
  new MarniesMorpeko(),
  new SpikemuthGym(),

  new StevensBeldum(),
  new StevensMetang(),
  new StevensMetagrossex(),
  new StevensCarbink(),
  new GraniteCave(),
];