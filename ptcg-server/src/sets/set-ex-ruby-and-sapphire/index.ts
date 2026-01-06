import { Card } from '../../game';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { Combusken } from './combusken';
import { DarknessEnergySpecial } from './darkness-energy-special';
import { Delcatty } from './delcatty';
import { Gardevoir } from './gardevoir';
import { Kirlia } from './kirlia';
import { LadyOuting } from './lady-outing';
import { Marshtomp } from './marshtomp';
import { Mudkip } from './mudkip';
import { OranBerry } from './oran-berry';
import { PokeNav } from './pokenav';
import { Ralts } from './ralts';
import { Sceptile } from './sceptile';
import { Skitty } from './skitty';
import { Skitty2 } from './skitty2';
import { Swampert } from './swampert';
import { Torchic } from './torchic';
import { Blaziken } from './blaziken';

// Other Prints
import {
  EnergySwitchRS,
  EnergyRemoval2RS,
  MetalEnergySpecialRS,
  RainbowEnergyRS,
  SwitchRS
} from './other-prints';

export const setEXRubyAndSapphire: Card[] = [
  new Combusken(),
  new DarknessEnergySpecial(),
  new Delcatty(),
  new Gardevoir(),
  new Kirlia(),
  new LadyOuting(),
  new Marshtomp(),
  new Mudkip(),
  new OranBerry(),
  new PokeNav(),
  new Ralts(),
  new Sceptile(),
  new Skitty(),
  new Skitty2(),
  new Swampert(),
  new Torchic(),
  new Blaziken(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),

  // Other Prints
  new EnergySwitchRS(),
  new EnergyRemoval2RS(),
  new MetalEnergySpecialRS(),
  new RainbowEnergyRS(),
  new SwitchRS(),
]; 
