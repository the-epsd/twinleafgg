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
import { ExpertBelt } from './expert-belt';
import { Gengar } from './gengar';
import { Spiritomb } from './spiritomb';

export const setArceus: Card[] = [
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
  new Gengar(),
  new Spiritomb()
];
