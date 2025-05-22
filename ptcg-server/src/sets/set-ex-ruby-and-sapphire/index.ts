import { Card } from '../../game';
import { DarknessEnergySpecial } from './darkness-energy-special';
import { Delcatty } from './delcatty';
import { Skitty } from './skitty';
import { Blaziken } from './blaziken';

// Other Prints
import { MetalEnergySpecialRS } from './other-prints';
import { RainbowEnergyRS } from './other-prints';

export const setEXRubyAndSapphire: Card[] = [
  new DarknessEnergySpecial(),
  new Delcatty(),
  new Skitty(),
  new Blaziken(),

  // Other Prints
  new MetalEnergySpecialRS(),
  new RainbowEnergyRS(),
]; 
