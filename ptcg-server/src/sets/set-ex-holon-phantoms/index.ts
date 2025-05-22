import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { HolonsCastform } from './holons-castform';
import { Meowth } from './meowth';
import { Oddish } from './oddish';
import { Pidgey } from './pidgey';
import { Pikachu } from './pikachu';
import { Raichu } from './raichu';

export const setEXHolonPhantoms: Card[] = [
  new Meowth(),
  new Oddish(),
  new Pidgey(),
  new Pikachu(),
  new Raichu(),
  new HolonsCastform(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
];
