import { Card } from '../../game/store/card/card';
import { Gardevoir } from './gardevoir';
import { HeavyBall } from './heavy-ball';
import { MewtwoEx } from './mewtwo-ex';
import { Musharna } from './musharna';
import { PokemonCenter } from './pokemon-center';
import { PrismEnergy } from './prism-energy';
import { ReshiramEx } from './reshiram-ex';
import { ShayminEX } from './shaymin-ex';
import { SkyarrowBridge } from './skyarrow-bridge';
import { Sneasel } from './sneasel';
import { ZekromEx } from './zekrom-ex';

// Other Prints
import {
  DoubleColorlessEnergyNXD,
  LevelBallNXD
} from './other-prints';

export const setNextDestinies: Card[] = [
  new Gardevoir(),
  new HeavyBall(),
  new MewtwoEx(),
  new Musharna(),
  new PokemonCenter(),
  new PrismEnergy(),
  new ReshiramEx(),
  new ShayminEX(),
  new SkyarrowBridge(),
  new Sneasel(),
  new ZekromEx(),

  // Other Prints
  new DoubleColorlessEnergyNXD(),
  new LevelBallNXD(),
];
