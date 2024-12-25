import { Card } from '../../game/store/card/card';
import { MasterBallPLB, ScoopUpCyclonePLB, UltraBallPLB } from './card-images';
import { JirachiEx } from './jirachi-ex';
import { SilverBangle } from './silver-bangle';
import { VirizionEx } from './virizion-ex';
import { Wartortle } from './wartortle';

export const setPlasmaBlast: Card[] = [
  new JirachiEx(),
  new SilverBangle(),
  new VirizionEx(),
  new Wartortle(),

  //Reprints
  new ScoopUpCyclonePLB(),
  new UltraBallPLB(),
  new MasterBallPLB(),
];
