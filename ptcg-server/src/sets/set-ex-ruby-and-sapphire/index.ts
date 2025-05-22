import { Card } from '../../game';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { Delcatty } from './delcatty';
import { Skitty } from './skitty';
import { Blaziken } from './blaziken';

export const setEXRubyAndSapphire: Card[] = [
  new Delcatty(),
  new Skitty(),
  new Blaziken(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
]; 
