import { Card } from '../../game';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { Absolex } from './absol-ex';
import { BattleFrontier } from './battle-frontier';
import { ClawFossil } from './claw-fossil';
import { CycloneEnergy } from './cyclone-energy';
import { EnergyRemoval2 } from './energy-removal-2';
import { FlareonStar } from './flareon-star';
import { JolteonStar } from './jolteon-star';
import { Machoke } from './machoke';
import { Machop } from './machop';
import { MysteriousFossil } from './mysterious-fossil';
import { Salamenceex } from './salamence-ex';
import { Skitty } from './skitty';
import { StevensAdvice } from './stevens-advice';

// Other prints
import {
  DelcattyPK,
  EnergySwitchPK
} from './other-prints';

export const setEXPowerKeepers: Card[] = [
  new Absolex(),
  new BattleFrontier(),
  new ClawFossil(),
  new CycloneEnergy(),
  new EnergyRemoval2(),
  new FlareonStar(),
  new JolteonStar(),
  new Machoke(),
  new Machop(),
  new MysteriousFossil(),
  new Salamenceex(),
  new Skitty(),
  new StevensAdvice(),

  // Other prints
  new DelcattyPK(),
  new EnergySwitchPK(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
];