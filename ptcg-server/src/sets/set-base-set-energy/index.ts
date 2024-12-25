import { Card } from '../../game/store/card/card';
import { FightingEnergy } from './fighting-energy';
import { FireEnergy } from './fire-energy';
import { GrassEnergy } from './grass-energy';
import { LightningEnergy } from './lightning-energy';
import { PsychicEnergy } from './psychic-energy';
import { WaterEnergy } from './water-energy';

export const setBaseSetEnergy: Card[] = [

  new FightingEnergy(),
  new FireEnergy(),
  new GrassEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new WaterEnergy(),
];