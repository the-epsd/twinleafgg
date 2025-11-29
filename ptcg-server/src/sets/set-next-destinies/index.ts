import { ReshiramNXD, ZekromNXD, RioluNXD, ExpShareNXD, ShayminEX2NXD, ReshiramEx2NXD, ZekromEx2NXD, MewtwoEx2NXD, EmboarNXD, Chandelure2NXD, ZoroarkNXD } from './other-prints';
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
  new ReshiramNXD(),
  new ZekromNXD(),
  new RioluNXD(),
  new ExpShareNXD(),
  new ShayminEX2NXD(),
  new ReshiramEx2NXD(),
  new ZekromEx2NXD(),
  new MewtwoEx2NXD(),
  new EmboarNXD(),
  new Chandelure2NXD(),
  new ZoroarkNXD(),
];
