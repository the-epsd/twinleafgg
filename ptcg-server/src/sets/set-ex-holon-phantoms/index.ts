import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { Armaldo } from './armaldo';
import { Chimecho } from './chimecho';
import { DeltaRainbowEnergy } from './delta-rainbow-energy';
import { Exeggcute } from './exeggcute';
import { Exeggutor } from './exeggutor';
import { Flygon } from './flygon';
import { HolonAdventurer } from './holon-adventurer';
import { HolonFossil } from './holon-fossil';
import { HolonsCastform } from './holons-castform';
import { Horsea } from './horsea';
import { Latias } from './latias';
import { Meowth } from './meowth';
import { Oddish } from './oddish';
import { Pidgey } from './pidgey';
import { Pidgeotto } from './pidgeotto';
import { Pikachu } from './pikachu';
import { Raichu } from './raichu';
import { RareCandy } from './rare-candy';
import { Trapinch } from './trapinch';
import { Vibrava } from './vibrava';

export const setEXHolonPhantoms: Card[] = [
  new Armaldo(),
  new Chimecho(),
  new DeltaRainbowEnergy(),
  new Exeggcute(),
  new Exeggutor(),
  new Flygon(),
  new Horsea(),
  new Latias(),
  new Meowth(),
  new Oddish(),
  new Pidgey(),
  new Pidgeotto(),
  new Pikachu(),
  new Raichu(),
  new RareCandy(),
  new HolonAdventurer(),
  new HolonFossil(),
  new HolonsCastform(),
  new Trapinch(),
  new Vibrava(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
];
