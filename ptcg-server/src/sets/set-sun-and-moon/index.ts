import { Card } from '../../game/store/card/card';
import { AlolanGrimer } from './alolan-grimer';
import { AlolanMuk } from './alolan-muk';
import { AlolanRattata } from './alolan_rattata';
import { EnergyRetrievalSUM, ExpShareSUM, NestBallSUM, RareCandySUM } from './card-images';
import { DecidueyeGX } from './decidueye-gx';
import { Dragonair } from './dragonair';
import { Fomantis } from './fomantis';
import { Golduck } from './golduck';
import { Herdier } from './herdier';
import { LurantisGX } from './lurantis-gx';
import { Oranguru } from './oranguru';
import { ProfessorKukui } from './professor-kukui';
import { RainbowEnergy } from './rainbow-energy';
import { Repel } from './repel';
import { TimerBall } from './timer-ball';

export const setSunAndMoon: Card[] = [
  new AlolanGrimer(),
  new AlolanMuk(),
  new AlolanRattata(),
  new DecidueyeGX(),
  new Dragonair(),
  new Fomantis(),
  new Golduck(),
  new Herdier(),
  new LurantisGX(),
  new Oranguru(),
  new ProfessorKukui(),
  new RainbowEnergy(),
  new Repel(),
  new TimerBall(),

  //Reprints
  new NestBallSUM(),
  new RareCandySUM(),
  new EnergyRetrievalSUM(),
  new ExpShareSUM(),
];
