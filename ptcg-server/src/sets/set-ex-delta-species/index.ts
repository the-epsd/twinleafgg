import { Card } from '../../game/store/card/card';
import { HolonsElectrode } from './holons-electrode';
import { HolonsVoltorb } from './holons-voltorb';
import { SuperScoopUpDS } from './other-prints';

export const setEXDeltaSpecies: Card[] = [
  new HolonsElectrode(),
  new HolonsVoltorb(),
  new SuperScoopUpDS(),
];
