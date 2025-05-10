import { Card } from '../../game';
import { Challenge } from './challenge';
import { GoopGasAttack } from './goop-gas-attack';
import { NightlyGarbageRun } from './nightly-garbage-run';
import { Porygon } from './porygon';

export const setTeamRocket: Card[] = [
  new Challenge(),
  new GoopGasAttack(),
  new NightlyGarbageRun(),
  new Porygon(),
];