import { Card } from '../../game/store/card/card';
import { Deerling } from './deerling';
import { EnergyPouch } from './energy-pouch';
import { Fennekin } from './fennekin';
import { Lucario } from './lucario';
import { Mew } from './mew';
import { N_Supporter } from './n';
import { Riolu } from './riolu';
import { TeamRocketsHandiwork } from './team-rockets-handiwork';

export const setFatesCollide: Card[] = [
  new Deerling(),
  new EnergyPouch(),
  new Fennekin(),
  new Lucario(),
  new Mew(),
  new N_Supporter(),
  new Riolu(),
  new TeamRocketsHandiwork(),
];
