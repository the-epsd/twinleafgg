import { EnergySearchBLW, EnergySwitchPKBLW, FullHealBLW, PokeBallBLW, PokemonCommunicationHSBLW, PotionBLW, SuperScoopUpBLW, Reshiram2BLW, Zekrom2BLW } from './other-prints';
import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy, DarknessEnergy, MetalEnergy } from './basic-energies';
import { Cinccino } from './cinccino';
import { Duosion } from './duosion';
import { Emboar } from './emboar';
import { Herdier } from './herdier';
import { Lillipup } from './lillipup';
import { Minccino } from './minccino';
import { Pignite } from './pignite';
import { Pignite2 } from './pignite2';
import { PlusPower } from './plus-power';
import { Pokedex } from './pokedex';
import { ProfessorJuniper } from './professor-juniper';
import { Reshiram } from './reshiram';
import { Reuniclus } from './reuniclus';
import { Revive } from './revive';
import { Solosis } from './solosis';
import { Tepig } from './tepig';
import { Zekrom } from './zekrom';
import { Zoroark } from './zoroark';
import { Zorua } from './zorua';

// Other Prints
import {
  EnergyRetrievalBLW,
  SwitchBLW,
} from './other-prints';

export const setBlackAndWhite: Card[] = [
  new Cinccino(),
  new Duosion(),
  new Emboar(),
  new Herdier(),
  new Lillipup(),
  new Minccino(),
  new Pignite(),
  new Pignite2(),
  new PlusPower(),
  new Pokedex(),
  new ProfessorJuniper(),
  new Reshiram(),
  new Reuniclus(),
  new Revive(),
  new Solosis(),
  new Tepig(),
  new Zekrom(),
  new Zoroark(),
  new Zorua(),

  // Other Prints
  new EnergyRetrievalBLW(),
  new SwitchBLW(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
  new DarknessEnergy(),
  new MetalEnergy(),
  new EnergySearchBLW(),
  new EnergySwitchPKBLW(),
  new FullHealBLW(),
  new PokeBallBLW(),
  new PokemonCommunicationHSBLW(),
  new PotionBLW(),
  new SuperScoopUpBLW(),
  new Reshiram2BLW(),
  new Zekrom2BLW(),
];
