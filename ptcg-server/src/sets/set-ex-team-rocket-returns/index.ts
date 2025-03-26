import { Card } from '../../game';
import { PowHandExtension } from './pow-hand-extension';
import { RocketsAdmin } from './rockets-admin';
import { SurpriseTimeMachine } from './surprise-time-machine';

export const setEXTeamRocketReturns: Card[] = [
  new PowHandExtension(),
  new RocketsAdmin(),
  new SurpriseTimeMachine()
];