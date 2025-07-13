import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy, DarknessEnergy, MetalEnergy, FairyEnergy } from './basic-energies';
import { Aromatisse } from './aromatisse';
import { Braixen } from './braixen';
import { Cassius } from './cassius';
import { Delphox } from './delphox';
import { DoubleColorlessEnergy } from './double-colorless-energy';
import { Evosoda } from './evosoda';
import { FairyGarden } from './fairy-garden';
import { Fennekin } from './fennekin';
import { Greninja } from './greninja';
import { MuscleBand } from './muscle-band';
import { Phantump } from './phantump';
import { Pikachu } from './pikachu';
import { ProfessorsLetter } from './professors-letter';
import { Raichu } from './raichu';
import { RollerSkates } from './roller-skates';
import { ShadowCircle } from './shadow-circle';
import { Shauna } from './shauna';
import { Spritzee } from './spritzee';
import { SuperPotion } from './super-potion';
import { Trevenant } from './trevenant';
import { Voltorb } from './voltorb';
import { XerneasEX } from './xerneas-ex';
import { YveltalEx } from './yveltal-ex';

export const setXY: Card[] = [
  new Aromatisse(),
  new Braixen(),
  new Cassius(),
  new Delphox(),
  new DoubleColorlessEnergy(),
  new Evosoda(),
  new FairyGarden(),
  new Fennekin(),
  new Greninja(),
  new MuscleBand(),
  new Phantump(),
  new Pikachu(),
  new ProfessorsLetter(),
  new Raichu(),
  new RollerSkates(),
  new ShadowCircle(),
  new Shauna(),
  new Spritzee(),
  new SuperPotion(),
  new Trevenant(),
  new Voltorb(),
  new XerneasEX(),
  new YveltalEx(),

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
