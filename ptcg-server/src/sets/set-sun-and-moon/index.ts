import { Card } from '../../game/store/card/card';
import { Dartrix } from '../set-shining-fates/dartrix';
import { AlolanGrimer } from './alolan-grimer';
import { AlolanMuk } from './alolan-muk';
import { AlolanRattata } from './alolan_rattata';
import { EnergyRetrievalSUM, ExpShareSUM, NestBallSUM, RareCandySUM, RotomDexSR } from './card-images';
import { DecidueyeGX } from './decidueye-gx';
import { Dragonair } from './dragonair';
import { Eevee } from './eevee';
import { EspeonGX } from './espeon-gx';
import { Fomantis } from './fomantis';
import { Golduck } from './golduck';
import { Herdier } from './herdier';
import { LurantisGX } from './lurantis-gx';
import { Oranguru } from './oranguru';
import { PassimianSUM } from './passimian';
import { ProfessorKukui } from './professor-kukui';
import { RainbowEnergy } from './rainbow-energy';
import { Repel } from './repel';
import { RotomDex } from './rotom-dex';
import { Rowlet } from './rowlet';
import { TimerBall } from './timer-ball';

export const setSunAndMoon: Card[] = [
  new AlolanGrimer(),
  new AlolanMuk(),
  new AlolanRattata(),
  new Dartrix(),
  new DecidueyeGX(),
  new Dragonair(),
  new Eevee(),
  new EspeonGX(),
  new Fomantis(),
  new Golduck(),
  new Herdier(),
  new LurantisGX(),
  new Oranguru(),
  new PassimianSUM(),
  new ProfessorKukui(),
  new RainbowEnergy(),
  new RotomDex(),
  new Rowlet(),
  new Repel(),
  new TimerBall(),

  // Reprints
  new NestBallSUM(),
  new RareCandySUM(),
  new EnergyRetrievalSUM(),
  new ExpShareSUM(),

  // Full Arts
  new RotomDexSR(),
];
