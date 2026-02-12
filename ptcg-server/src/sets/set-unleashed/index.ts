import { JirachiUL, CheerleadersCheerUL, PlusPowerUL } from './other-prints';
import { Card } from '../../game/store/card/card';
import { Chinchou } from './chinchou';
import { Crobat } from './crobat-prime';
import { DualBall } from './dual-ball';
import { EnteiAndRaikouLegendBottom } from './entei-and-raikou-legend-bottom';
import { EnteiAndRaikouLegendTop } from './entei-and-raikou-legend-top';
import { Golbat } from './golbat';
import { Horsea } from './horsea';
import { InterviewersQuestions } from './interviewers-questions';
import { Kingdra } from './kingdra';
import { Lanturn } from './lanturn';
import { PokemonCirculator } from './pokemon-circulator';
import { Seadra } from './seadra';
import { Shaymin } from './shaymin';
import { Vulpix } from './vulpix';
import { Zubat } from './zubat';

// Other prints
import {
  JudgeUL,
  RareCandyUL,
  SuperScoopUpUL
} from './other-prints';

export const setUnleashed: Card[] = [
  new Chinchou(),
  new Crobat(),
  new DualBall(),
  new EnteiAndRaikouLegendBottom(),
  new EnteiAndRaikouLegendTop(),
  new Golbat(),
  new Horsea(),
  new InterviewersQuestions(),
  new Kingdra(),
  new Lanturn(),
  new PokemonCirculator(),
  new Seadra(),
  new Shaymin(),
  new Vulpix(),
  new Zubat(),

  // Other prints
  new JudgeUL(),
  new RareCandyUL(),
  new SuperScoopUpUL(),
  new JirachiUL(),
  new CheerleadersCheerUL(),
  new PlusPowerUL(),
];
