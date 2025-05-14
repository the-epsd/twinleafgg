import { Card } from '../../game';
import { Challenge } from './challenge';
import { NightlyGarbageRun } from './nightly-garbage-run';
import { Porygon } from './porygon';
import { Rattata } from './rattata';

export const setTeamRocket: Card[] = [
  new Challenge(),
  new NightlyGarbageRun(),
  new Porygon(),
  new Rattata(),
];