import { Card } from '../../game';
import { Challenge } from './challenge';
import { Drowzee } from './drowzee';
import { GoopGasAttack } from './goop-gas-attack';
import { NightlyGarbageRun } from './nightly-garbage-run';
import { Porygon } from './porygon';
import { Rattata } from './rattata';

export const setTeamRocket: Card[] = [
  new Challenge(),
  new Drowzee(),
  new GoopGasAttack(),
  new NightlyGarbageRun(),
  new Porygon(),
  new Rattata(),
];