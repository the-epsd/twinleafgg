import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { BlainesLastResort } from './blaines-last-resort';
import { ErikasPerfume } from './erikas-perfume';

export const setGymHeros: Card[] = [
  new BlainesLastResort(),
  new ErikasPerfume(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
];
