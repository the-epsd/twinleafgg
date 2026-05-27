import { Card } from '../../game/store/card/card';
import {
  DarknessEnergyMEE,
  FightingEnergyMEE,
  FireEnergyMEE,
  GrassEnergyMEE,
  LightningEnergyMEE,
  MetalEnergyMEE,
  PsychicEnergyMEE,
  WaterEnergyMEE,
} from './other-prints';

export const setMegaEvolutionEnergy: Card[] = [
  new GrassEnergyMEE(),
  new FireEnergyMEE(),
  new WaterEnergyMEE(),
  new LightningEnergyMEE(),
  new PsychicEnergyMEE(),
  new FightingEnergyMEE(),
  new DarknessEnergyMEE(),
  new MetalEnergyMEE(),
];
