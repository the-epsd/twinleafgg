import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy, DarknessEnergy, MetalEnergy } from './basic-energies';
import { Cleffa } from './cleffa';
import { Meditite } from './meditite';
import { PlusPower } from './pluspower';
import { PokedexHandy } from './pokedex-handy';
import { SpeedStadium } from './speed-stadium';
import { SuperScoopUp } from './super-scoop-up';
import { Wynaut } from './wynaut';

export const setDiamondAndPearl: Card[] = [
  new Cleffa(),
  new Meditite(),
  new PlusPower(),
  new PokedexHandy(),
  new SpeedStadium(),
  new SuperScoopUp(),
  new Wynaut(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
  new DarknessEnergy(),
  new MetalEnergy(),
];
