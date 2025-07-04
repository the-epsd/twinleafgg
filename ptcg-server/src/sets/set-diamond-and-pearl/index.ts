import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy, DarknessEnergy, MetalEnergy } from './basic-energies';
import { Chimchar } from './chimchar';
import { Cleffa } from './cleffa';
import { Empoleon } from './empoleon';
import { Infernape } from './infernape';
import { Meditite } from './meditite';
import { Piplup } from './piplup';
import { PlusPower } from './pluspower';
import { PokedexHandy } from './pokedex-handy';
import { Prinplup } from './prinplup';
import { SpeedStadium } from './speed-stadium';
import { SuperScoopUp } from './super-scoop-up';
import { Wynaut } from './wynaut';

// Other prints
import { SwitchDP } from './other-prints';

export const setDiamondAndPearl: Card[] = [
  new Chimchar(),
  new Cleffa(),
  new Empoleon(),
  new Infernape(),
  new Meditite(),
  new Piplup(),
  new PlusPower(),
  new PokedexHandy(),
  new Prinplup(),
  new SpeedStadium(),
  new SuperScoopUp(),
  new Wynaut(),

  // Other prints
  new SwitchDP(),

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
