import { Card } from '../../game/store/card/card';
import { AlakazamEx } from './alakazam-ex';
import { AlakazamSpiritLink } from './alakazam-spirit-link';
import { AudinoEx } from './audino-ex';
import { AudinoSpiritLink } from './audino-spirit-link';
import { Deerling } from './deerling';
import { Diglett } from './diglett';
import { EnergyPouch } from './energy-pouch';
import { Fennekin } from './fennekin';
import { Lucario } from './lucario';
import { MAlakazamEx } from './mega-alakazam-ex';
import { MAudinoEx } from './mega-audino-ex';
import { Mew } from './mew';
import { N } from './n';
import { RegirockEx } from './regirock-ex';
import { Riolu } from './riolu';
import { TeamRocketsHandiwork } from './team-rockets-handiwork';
import { Whismur } from './whismur';

export const setFatesCollide: Card[] = [
  new Deerling(),
  new Diglett(),
  new EnergyPouch(),
  new Fennekin(),
  new Lucario(),
  new Mew(),
  new N(),
  new Riolu(),
  new TeamRocketsHandiwork(),
  new Whismur(),
  new AudinoEx(),
  new MAudinoEx(),
  new AudinoSpiritLink(),
  new AlakazamEx(),
  new MAlakazamEx(),
  new AlakazamSpiritLink(),
  new RegirockEx(),
];
