import { Card } from '../../game';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { EnergyRemoval2 } from './energy-removal-2';
import { FlareonStar } from './flareon-star';
import { StevensAdvice } from './stevens-advice';

export const setEXPowerKeepers: Card[] = [
  new EnergyRemoval2(),
  new FlareonStar(),
  new StevensAdvice(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
];