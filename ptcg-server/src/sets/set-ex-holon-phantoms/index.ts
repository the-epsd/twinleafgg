import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { HolonAdventurer } from './holon-adventurer';
import { Chimecho } from './chimecho';
import { DeltaRainbowEnergy } from './delta-rainbow-energy';
import { Exeggcute } from './exeggcute';
import { Exeggutor } from './exeggutor';
import { HolonsCastform } from './holons-castform';
import { Meowth } from './meowth';
import { Oddish } from './oddish';
import { Pidgey } from './pidgey';
import { Pikachu } from './pikachu';
import { Raichu } from './raichu';

export const setEXHolonPhantoms: Card[] = [
  new HolonAdventurer(),
  new Chimecho(),
  new DeltaRainbowEnergy(),
  new Exeggcute(),
  new Exeggutor(),
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
