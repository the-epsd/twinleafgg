import { Card } from '../../game';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { DarknessEnergySpecial } from './darkness-energy-special';
import { Delcatty } from './delcatty';
import { Sceptile } from './sceptile';
import { Skitty } from './skitty';
import { Blaziken } from './blaziken';

// Other Prints
import { MetalEnergySpecialRS } from './other-prints';
import { RainbowEnergyRS } from './other-prints';

export const setEXRubyAndSapphire: Card[] = [
  new DarknessEnergySpecial(),
  new Delcatty(),
  new Sceptile(),
  new Skitty(),
  new Blaziken(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),

  // Other Prints
  new MetalEnergySpecialRS(),
  new RainbowEnergyRS(),
]; 
