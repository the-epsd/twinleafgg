import { Card } from '../../game/store/card/card';
import { AncientMew } from './ancient-mew';
import { VictoryMedal } from './victory-medal';
import { VictoryOrb } from './victory-orb';
import { VictoryRing } from './victory-ring';

export const setUnnumberedPromos: Card[] = [
  new AncientMew(),
  new VictoryMedal(),
  new VictoryOrb(),
  new VictoryRing(),
];