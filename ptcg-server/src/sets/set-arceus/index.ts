import { Card } from '../../game/store/card/card';
import { Arceus } from './arceus';
import { ArceusDark } from './arceus-dark';
import { ArceusFighting } from './arceus-fighting';
import { ArceusFire } from './arceus-fire';
import { ArceusGrass } from './arceus-grass';
import { ArceusLightning } from './arceus-lightning';
import { ArceusLvX1 } from './arceus-lv-x-1';
import { ArceusLvX2 } from './arceus-lv-x-2';
import { ArceusLvX3 } from './arceus-lv-x-3';
import { ArceusMetal } from './arceus-metal';
import { ArceusPsychic } from './arceus-psychic';
import { ArceusWater } from './arceus-water';
import { BeginningDoor } from './beginning-door';
import { ExpertBelt } from './expert-belt';
import { Froslass } from './froslass';
import { Gengar } from './gengar';
import { LuckyEgg } from './lucky-egg';
import { Spiritomb } from './spiritomb';
import { UltimateZone } from './ultimate-zone';

export const setArceus: Card[] = [
  new BeginningDoor(),
  new ExpertBelt(),
  new Arceus(),
  new ArceusMetal(),
  new ArceusFighting(),
  new ArceusPsychic(),
  new ArceusLightning(),
  new ArceusWater(),
  new ArceusFire(),
  new ArceusGrass(),
  new ArceusDark(),
  new ArceusLvX1(),
  new ArceusLvX2(),
  new ArceusLvX3(),
  new Froslass(),
  new Gengar(),
  new LuckyEgg(),
  new Spiritomb(),
  new UltimateZone()
];
