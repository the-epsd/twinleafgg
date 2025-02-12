import { Card } from '../../game/store/card/card';
import { Archen } from './archen';
import { MasterBallPLB, ScoopUpCyclonePLB, UltraBallPLB } from './card-images';
import {GBooster} from './g-booster';
import {GScope} from './g-scope';
import {GenesectEX} from './genesect-ex';
import { JirachiEx } from './jirachi-ex';
import { SilverBangle } from './silver-bangle';
import { Suicune } from './suicune';
import { VirizionEx } from './virizion-ex';
import { Wartortle } from './wartortle';

export const setPlasmaBlast: Card[] = [
  new Archen(),
  new JirachiEx(),
  new SilverBangle(),
  new Suicune(),
  new VirizionEx(),
  new Wartortle(),
  new GenesectEX(),
  new GBooster(),
  new GScope(),

  //Reprints
  new ScoopUpCyclonePLB(),
  new UltraBallPLB(),
  new MasterBallPLB(),
];
