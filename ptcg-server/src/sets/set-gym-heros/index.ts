import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { BlainesLastResort } from './blaines-last-resort';
import { BlainesPonyta } from './blaines-ponyta';
import { BrocksMankey } from './brocks-mankey';
import { BrocksZubat } from './brocks-zubat';
import { ErikasPerfume } from './erikas-perfume';
import { GoodManners } from './good-manners';
import { MistysPoliwhirl } from './mistys-poliwhirl';
import { MistysWrath } from './mistys-wrath';
import { TheRocketsTrainingGym } from './the-rockets-training-gym';

export const setGymHeros: Card[] = [
  new BlainesLastResort(),
  new BlainesPonyta(),
  new BrocksMankey(),
  new BrocksZubat(),
  new ErikasPerfume(),
  new GoodManners(),
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
