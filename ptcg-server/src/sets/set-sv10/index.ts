import { Card } from '../../game/store/card/card';
import { GraniteCave } from './granite-cave';
import { MarniesGrimmsnarlex } from './marnies-grimmsnarl-ex';
import { MarniesImpidimp } from './marnies-impidimp';
import { MarniesLiepard } from './marnies-liepard';
import { MarniesMorgrem } from './marnies-morgrem';
import { MarniesMorpeko } from './marnies-morpeko';
import { MarniesPurrloin } from './marnies-purrloin';
import { MarniesScrafty } from './marnies-scrafty';
import { MarniesScraggy } from './marnies-scraggy';
import { EnergyRecyclerSV10 } from './other-prints';
import { SpikemuthGym } from './spikemuth-gym';
import { StevensBaltoy } from './stevens-baltoy';
import { StevensBeldum } from './stevens-beldum';
import { StevensCarbink } from './stevens-carbink';
import { StevensClaydol } from './stevens-claydol';
import { StevensMetagrossex } from './stevens-metagross-ex';
import { StevensMetang } from './stevens-metang';
import { StevensSkarmory } from './stevens-skarmory';

export const setSV10: Card[] = [
  new MarniesImpidimp(),
  new MarniesMorgrem(),
  new MarniesGrimmsnarlex(),
  new MarniesMorpeko(),
  new MarniesPurrloin(),
  new MarniesLiepard(),
  new MarniesScrafty(),
  new MarniesScraggy(),
  new SpikemuthGym(),

  new StevensBeldum(),
  new StevensMetang(),
  new StevensMetagrossex(),
  new StevensCarbink(),
  new StevensBaltoy(),
  new StevensClaydol(),
  new StevensSkarmory(),
  new GraniteCave(),

  new EnergyRecyclerSV10(),
];