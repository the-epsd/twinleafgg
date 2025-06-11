import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { BlainesLastResort } from './blaines-last-resort';
import { BrocksMankey } from './brocks-mankey';
import { BrocksZubat } from './brocks-zubat';
import { ErikasPerfume } from './erikas-perfume';
import { MistysPoliwhirl } from './mistys-poliwhirl';
import { MistysWrath } from './mistys-wrath';
import { TheRocketsTrainingGym } from './the-rockets-training-gym';

export const setGymHeros: Card[] = [
  new BlainesLastResort(),
  new BrocksMankey(),
  new BrocksZubat(),
  new ErikasPerfume(),
  new MistysPoliwhirl(),
  new MistysWrath(),
  new TheRocketsTrainingGym(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
];
