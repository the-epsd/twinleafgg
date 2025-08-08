import { Card } from '../../game/store/card/card';
import { Archen } from './archen';
import { Drifblim } from './drifblim';
import { Drifloon } from './drifloon';
import { GBooster } from './g-booster';
import { GScope } from './g-scope';
import { GenesectEX } from './genesect-ex';
import { JirachiEX } from './jirachi-ex';
import { PalkiaEX } from './palkia-ex';
import { Sawk } from './sawk';
import { Shelmet } from './shelmet';
import { Sigilyph } from './sigilyph';
import { SilverBangle } from './silver-bangle';
import { SilverMirror } from './silver-mirror';
import { Suicune } from './suicune';
import { VirizionEX } from './virizion-ex';
import { Wartortle } from './wartortle';

// Other Prints
import {
  MasterBallPLB,
  ProfessorJuniperPLB,
  ScoopUpCyclonePLB,
  UltraBallPLB,
} from './other-prints';

export const setPlasmaBlast: Card[] = [
  new Archen(),
  new Drifblim(),
  new Drifloon(),
  new GBooster(),
  new GenesectEX(),
  new GScope(),
  new JirachiEX(),
  new PalkiaEX(),
  new Sawk(),
  new Shelmet(),
  new Sigilyph(),
  new SilverBangle(),
  new SilverMirror(),
  new Suicune(),
  new VirizionEX(),
  new Wartortle(),

  //Reprints
  new ScoopUpCyclonePLB(),
  new UltraBallPLB(),
  new MasterBallPLB(),
  new ProfessorJuniperPLB(),
];
