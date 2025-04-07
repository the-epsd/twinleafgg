import { Card } from '../../game/store/card/card';
import { HolonsElectrode } from './holons-electrode';
import { HolonsMagnemite } from './holons-magnemite';
import { HolonsMagneton } from './holons-magneton';
import { HolonsVoltorb } from './holons-voltorb';
import { Meowth } from './meowth';
import { Persian } from './persian';
import { SuperScoopUpDS } from './other-prints';

export const setEXDeltaSpecies: Card[] = [
  new HolonsElectrode(),
  new HolonsMagnemite(),
  new HolonsMagneton(),
  new HolonsVoltorb(),
  new Meowth(),
  new Persian(),
  new SuperScoopUpDS(),
];
