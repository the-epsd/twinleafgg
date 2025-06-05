import { Card } from '../../game';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { CycloneEnergy } from './cyclone-energy';
import { EnergyRemoval2 } from './energy-removal-2';
import { FlareonStar } from './flareon-star';
import { JolteonStar } from './jolteon-star';
import { Machoke } from './machoke';
import { Machop } from './machop';
import { Skitty } from './skitty';
import { StevensAdvice } from './stevens-advice';

export const setEXPowerKeepers: Card[] = [
  new CycloneEnergy(),
  new EnergyRemoval2(),
  new FlareonStar(),
  new JolteonStar(),
  new Machoke(),
  new Machop(),
  new Skitty(),
  new StevensAdvice(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
];