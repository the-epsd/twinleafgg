import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy, DarknessEnergy, MetalEnergy } from './basic-energies';
import { Herdier } from './herdier';
import { Lillipup } from './lillipup';
import { Pignite } from './pignite';
import { PlusPower } from './plus-power';
import { Pokedex } from './pokedex';
import { ProfessorJuniper } from './professor-juniper';
import { Reshiram } from './reshiram';
import { Revive } from './revive';
import { Tepig } from './tepig';
import { Zekrom } from './zekrom';
import { Zoroark } from './zoroark';
import { Zorua } from './zorua';

export const setBlackAndWhite: Card[] = [
  new Herdier(),
  new Lillipup(),
  new Pignite(),
  new PlusPower(),
  new Pokedex(),
  new ProfessorJuniper(),
  new Reshiram(),
  new Revive(),
  new Tepig(),
  new Zekrom(),
  new Zoroark(),
  new Zorua(),

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
