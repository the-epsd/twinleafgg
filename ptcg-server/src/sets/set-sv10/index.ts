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
import { EnergyRecyclerSV10, MarniesMorpekoIR, StevensBeldumIR } from './other-prints';
import { SpikemuthGym } from './spikemuth-gym';
import { StevensBaltoy } from './stevens-baltoy';
import { StevensBeldum } from './stevens-beldum';
import { StevensCarbink } from './stevens-carbink';
import { StevensClaydol } from './stevens-claydol';
import { StevensMetagrossex } from './stevens-metagross-ex';
import { StevensMetang } from './stevens-metang';
import { StevensSkarmory } from './stevens-skarmory';
import { TeamRocketEnergy } from './team-rocket-energy';
import { TeamRocketsArcher } from './team-rockets-archer';
import { TeamRocketsAriana } from './team-rockets-ariana';
import { TeamRocketsGiovanni } from './team-rockets-giovanni';
import {TeamRocketsMeowth} from './team-rockets-meowth';
import { TeamRocketsMewtwoex } from './team-rockets-mewtwo-ex';
import {TeamRocketsPersianex} from './team-rockets-persian-ex';
import { TeamRocketsPorygon } from './team-rockets-porygon';
import { TeamRocketsPorygonZ } from './team-rockets-porygon-z';
import { TeamRocketsPorygon2 } from './team-rockets-porygon2';
import { TeamRocketsReceiver } from './team-rockets-receiver';
import { TeamRocketsSpidops } from './team-rockets-spidops';
import { TeamRocketsTarountula } from './team-rockets-tarountula';

export const setSV10: Card[] = [
  new MarniesMorpekoIR(),
  new MarniesImpidimp(),
  new MarniesMorgrem(),
  new MarniesGrimmsnarlex(),
  new MarniesMorpeko(),
  new MarniesPurrloin(),
  new MarniesLiepard(),
  new MarniesScrafty(),
  new MarniesScraggy(),
  new SpikemuthGym(),

  new StevensBeldumIR(),
  new StevensBeldum(),
  new StevensMetang(),
  new StevensMetagrossex(),
  new StevensCarbink(),
  new StevensBaltoy(),
  new StevensClaydol(),
  new StevensSkarmory(),
  new GraniteCave(),

  new TeamRocketsMewtwoex(),
  new TeamRocketsTarountula(),
  new TeamRocketsSpidops(),
  new TeamRocketsPorygon(),
  new TeamRocketsPorygon2(),
  new TeamRocketsPorygonZ(),
  new TeamRocketsReceiver(),
  new TeamRocketsArcher(),
  new TeamRocketsAriana(),
  new TeamRocketEnergy(),
  new TeamRocketsGiovanni(),
  new TeamRocketsMeowth(),
  new TeamRocketsPersianex(),

  new EnergyRecyclerSV10(),
];