import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy, DarknessEnergy, MetalEnergy, FairyEnergy } from './basic-energies';
import { Braixen } from './braixen';
import { Cassius } from './cassius';
import { Delphox } from './delphox';
import { DoubleColorlessEnergy } from './double-colorless-energy';
import { Evosoda } from './evosoda';
import { Fennekin } from './fennekin';
import { Greninja } from './greninja';
import { MuscleBand } from './muscle-band';
import { Pikachu } from './pikachu';
import { ProfessorsLetter } from './professors-letter';
import { Raichu } from './raichu';
import { ShadowCircle } from './shadow-circle';
import { Shauna } from './shauna';
import { SuperPotion } from './super-potion';
import { Trevenant } from './trevenant';
import { Voltorb } from './voltorb';
import { YveltalEx } from './yveltal-ex';

export const setXY: Card[] = [
  new Braixen(),
  new Cassius(),
  new Delphox(),
  new DoubleColorlessEnergy(),
  new Evosoda(),
  new Greninja(),
  new MuscleBand(),
  new Pikachu(),
  new ProfessorsLetter(),
  new Raichu(),
  new ShadowCircle(),
  new Shauna(),
  new SuperPotion(),
  new Trevenant(),
  new Voltorb(),
  new YveltalEx(),
  new Fennekin(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
  new DarknessEnergy(),
  new MetalEnergy(),
  new FairyEnergy(),
];
