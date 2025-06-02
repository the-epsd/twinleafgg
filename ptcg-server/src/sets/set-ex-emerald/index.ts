import { Card } from '../../game';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { Feebas } from './feebas';
import { Medichamex } from './medicham-ex';
import { Meditite } from './meditite';
import { Scott } from './scott';

export const setEXEmerald: Card[] = [
  new Feebas(),
  new Medichamex(),
  new Meditite(),
  new Scott(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
];