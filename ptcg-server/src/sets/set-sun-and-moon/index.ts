import { Card } from '../../game/store/card/card';
import { AlolanGrimer } from './alolan-grimer';
import { AlolanMuk } from './alolan-muk';
import { AlolanRattata } from './alolan_rattata';
import { Brionne } from './brionne';
import { DoubleColorlessEnergySUM, EnergyRetrievalSUM, ExpShareSUM, HauSUM, NestBallSUM, RareCandySUM, RotomDexSR, UltraBallSUMSR } from './other-prints';
import { Charjabug } from './charjabug';
import { Cosmog } from './cosmog';
import { Cosmoem } from './cosmoem';
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
import { Popplio } from './popplio';
import { Primarina } from './primarina';
import { ProfessorKukui } from './professor-kukui';
import { RainbowEnergy } from './rainbow-energy';
import { Repel } from './repel';
import { RotomDex } from './rotom-dex';
import { Rowlet } from './rowlet';
import { Snubbull } from './snubbull';
import { TeamSkullGrunt } from './team-skull-grunt';
import { TimerBall } from './timer-ball';
import { TaurosGX } from './tauros-gx';
import { Vikavolt } from './vikavolt';
import { Wishiwashi } from './wishiwashi';
import { Dartrix } from './dartrix';
import { DarknessEnergy, FairyEnergy, FightingEnergy, FireEnergy, GrassEnergy, LightningEnergy, MetalEnergy, PsychicEnergy, WaterEnergy } from './basic-energies';


export const setSunAndMoon: Card[] = [
  new AlolanGrimer(),
  new AlolanMuk(),
  new AlolanRattata(),
  new Brionne(),
  new Cosmog(),
  new Cosmoem(),
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
  new Popplio(),
  new Primarina(),
  new ProfessorKukui(),
  new RainbowEnergy(),
  new RotomDex(),
  new Rowlet(),
  new Repel(),
  new Snubbull(),
  new TeamSkullGrunt(),
  new TimerBall(),
  new TaurosGX(),
  new Vikavolt(),
  new Wishiwashi(),

  // Reprints
  new DoubleColorlessEnergySUM(),
  new NestBallSUM(),
  new RareCandySUM(),
  new HauSUM(),
  new EnergyRetrievalSUM(),
  new ExpShareSUM(),

  // Full Arts
  new RotomDexSR(),
  new UltraBallSUMSR(),

  //Basic Energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
  new DarknessEnergy(),
  new MetalEnergy(),
  new FairyEnergy(),
];
