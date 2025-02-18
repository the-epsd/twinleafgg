import { Card } from '../../game/store/card/card';
import { Archen } from './archen';
import { MasterBallPLB, ScoopUpCyclonePLB, UltraBallPLB } from './card-images';
import { GBooster } from './g-booster';
import { GScope } from './g-scope';
import { GenesectEX } from './genesect-ex';
import { JirachiEX } from './jirachi-ex';
import { PalkiaEX } from './palkia-ex';
import { Sawk } from './sawk';
import { SilverBangle } from './silver-bangle';
import { SilverMirror } from './silver-mirror';
import { Suicune } from './suicune';
import { VirizionEX } from './virizion-ex';
import { Wartortle } from './wartortle';

export const setPlasmaBlast: Card[] = [
  new Archen(),
  new JirachiEX(),
  new PalkiaEX(),
  new Sawk(),
  new SilverBangle(),
  new SilverMirror(),
  new Suicune(),
  new VirizionEX(),
  new Wartortle(),
  new GenesectEX(),
  new GBooster(),
  new GScope(),

  //Reprints
  new ScoopUpCyclonePLB(),
  new UltraBallPLB(),
  new MasterBallPLB(),
];
