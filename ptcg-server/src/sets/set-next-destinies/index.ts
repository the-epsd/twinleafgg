import { Card } from '../../game/store/card/card';
import { LevelBall } from './level-ball';
import { MewtwoEx } from './mewtwo-ex';
import { Musharna } from './musharna';
import { NestBall } from './nest-ball';
import { PokemonCenter } from './pokemon-center';
import { PrismEnergy } from './prism-energy';
import { ReshiramEx } from './reshiram-ex';
import { SkyarrowBridge } from './skyarrow-bridge';
import { ZekromEx } from './zekrom-ex';

export const setNextDestinies: Card[] = [
  new LevelBall(),
  new NestBall(),
  new PrismEnergy(),
  new ReshiramEx(),
  new SkyarrowBridge(),
  new ZekromEx(),
  new MewtwoEx(),
  new Musharna(),
  new PokemonCenter(),

];
