import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { HolonAdventurer } from './holon-adventurer';
import { Chimecho } from './chimecho';
import { DeltaRainbowEnergy } from './delta-rainbow-energy';
import { Exeggcute } from './exeggcute';
import { Exeggutor } from './exeggutor';
import { Flygon } from './flygon';
import { HolonsCastform } from './holons-castform';
import { Horsea } from './horsea';
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
  new HolonAdventurer(),
  new Chimecho(),
  new DeltaRainbowEnergy(),
  new Exeggcute(),
  new Exeggutor(),
  new Flygon(),
  new Horsea(),
  new Meowth(),
  new Oddish(),
  new Pidgey(),
  new Pidgeotto(),
  new Pikachu(),
  new Raichu(),
  new RareCandy(),
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
