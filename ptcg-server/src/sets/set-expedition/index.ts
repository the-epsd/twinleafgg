import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { Bulbasaur } from './bulbasaur';
import { Charizard } from './charizard';
import { Charmander } from './charmander';
import { Charmeleon } from './charmeleon';
import { Clefable } from './clefable';
import { Clefairy } from './clefairy';
import { Dragonair } from './dragonair';
import { Dragonite } from './dragonite';
import { Dratini } from './dratini';
import { FullHeal } from './full-heal';
import { Gastly } from './gastly';
import { Gengar } from './gengar';
import { Ivysaur } from './ivysaur';
import { MultiTechnicalMachine01 } from './multi-technical-machine-01';
import { PokemonNurse } from './pokemon-nurse';
import { Venusaur } from './venusaur';

// Other prints
import {
  CopycatEX,
  DualBallEX,
  EnergySearchEX,
  PokemonReversalEX,
  ProfessorElmsTrainingMethodEX,
  ProfessorOaksResearchEX,
  StrengthCharmEX,
  SwitchEX,
} from './other-prints';

export const setExpedition: Card[] = [
  new Bulbasaur(),
  new Charizard(),
  new Charmander(),
  new Charmeleon(),
  new Clefable(),
  new Clefairy(),
  new Dragonair(),
  new Dragonite(),
  new Dratini(),
  new FullHeal(),
  new Gastly(),
  new Gengar(),
  new Ivysaur(),
  new MultiTechnicalMachine01(),
  new PokemonNurse(),
  new Venusaur(),

  // Other prints
  new CopycatEX(),
  new DualBallEX(),
  new EnergySearchEX(),
  new PokemonReversalEX(),
  new ProfessorElmsTrainingMethodEX(),
  new ProfessorOaksResearchEX(),
  new StrengthCharmEX(),
  new SwitchEX(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
];
