import { Card } from '../../game/store/card/card';
import { AlolanGrimer } from './alolan-grimer';
import { AlolanMuk } from './alolan-muk';
import { AlolanRattata } from './alolan_rattata';
import { EnergyRetrievalSUM, ExpShareSUM, NestBallSUM, RareCandySUM, RotomDexSR } from './other-prints';
import { Charjabug } from './charjabug';
import { DecidueyeGX } from './decidueye-gx';
import { Dragonair } from './dragonair';
import { Eevee } from './eevee';
import { EspeonGX } from './espeon-gx';
import { Fomantis } from './fomantis';
import { Golduck } from './golduck';
import { Grubbin } from './grubbin';
import { Herdier } from './herdier';
import { LurantisGX } from './lurantis-gx';
import { Oranguru } from './oranguru';
import { Passimian } from './passimian';
import { ProfessorKukui } from './professor-kukui';
import { RainbowEnergy } from './rainbow-energy';
import { Repel } from './repel';
import { RotomDex } from './rotom-dex';
import { Rowlet } from './rowlet';
import { TeamSkullGrunt } from './team-skull-grunt';
import { TimerBall } from './timer-ball';
import { TaurosGX } from './tauros-gx';
import { Vikavolt } from './vikavolt';
import { Dartrix } from './dartrix';

export const setSunAndMoon: Card[] = [
  new AlolanGrimer(),
  new AlolanMuk(),
  new AlolanRattata(),
  new Charjabug(),
  new Dartrix(),
  new DecidueyeGX(),
  new Dragonair(),
  new Eevee(),
  new EspeonGX(),
  new Fomantis(),
  new Golduck(),
  new Grubbin(),
  new Herdier(),
  new LurantisGX(),
  new Oranguru(),
  new Passimian(),
  new ProfessorKukui(),
  new RainbowEnergy(),
  new RotomDex(),
  new Rowlet(),
  new Repel(),
  new TeamSkullGrunt(),
  new TimerBall(),
  new TaurosGX(),
  new Vikavolt(),

  // Reprints
  new NestBallSUM(),
  new RareCandySUM(),
  new EnergyRetrievalSUM(),
  new ExpShareSUM(),

  // Full Arts
  new RotomDexSR(),
];
