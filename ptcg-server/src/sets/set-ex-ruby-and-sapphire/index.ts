import { Card } from '../../game';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { Combusken } from './combusken';
import { DarknessEnergySpecial } from './darkness-energy-special';
import { Delcatty } from './delcatty';
import { Gardevoir } from './gardevoir';
import { Grovyle } from './grovyle';
import { Kirlia } from './kirlia';
import { Kirlia2 } from './kirlia2';
import { LadyOuting } from './lady-outing';
import { Linoone } from './linoone';
import { Marshtomp } from './marshtomp';
import { Mewtwoex } from './mewtwo-ex';
import { Mudkip } from './mudkip';
import { OranBerry } from './oran-berry';
import { PokeNav } from './pokenav';
import { Ralts } from './ralts';
import { Sceptile } from './sceptile';
import { Skitty } from './skitty';
import { Skitty2 } from './skitty2';
import { Swampert } from './swampert';
import { Torchic } from './torchic';
import { Wailmer } from './wailmer';
import { Blaziken } from './blaziken';

// Other Prints
import {
  EnergySearchRS,
  EnergySwitchRS,
  EnergyRemoval2RS,
  MetalEnergySpecialRS,
  PokemonReversalRS,
  RainbowEnergyRS,
  SwitchRS
} from './other-prints';

export const setEXRubyAndSapphire: Card[] = [
  new Combusken(),
  new DarknessEnergySpecial(),
  new Delcatty(),
  new Grovyle(),
  new Gardevoir(),
  new Kirlia(),
  new Kirlia2(),
  new LadyOuting(),
  new Linoone(),
  new Marshtomp(),
  new Mewtwoex(),
  new Mudkip(),
  new OranBerry(),
  new PokeNav(),
  new Ralts(),
  new Sceptile(),
  new Skitty(),
  new Skitty2(),
  new Swampert(),
  new Torchic(),
  new Wailmer(),
  new Blaziken(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),

  // Other Prints
  new EnergySearchRS(),
  new EnergySwitchRS(),
  new EnergyRemoval2RS(),
  new MetalEnergySpecialRS(),
  new PokemonReversalRS(),
  new RainbowEnergyRS(),
  new SwitchRS(),
]; 
