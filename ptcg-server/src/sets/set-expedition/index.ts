import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy } from './basic-energies';
import { Dragonair } from './dragonair';
import { Dragonite } from './dragonite';
import { Dratini } from './dratini';
import { Gastly } from './gastly';
import { Gengar } from './gengar';
import { MultiTechnicalMachine01 } from './multi-technical-machine-01';
import { PokemonNurse } from './pokemon-nurse';

// Other prints
import { CopycatEX } from './other-prints';
import { EnergySearchEX } from './other-prints';
import { ProfessorElmsTrainingMethodEX } from './other-prints';
import { ProfessorOaksResearchEX } from './other-prints';

export const setExpedition: Card[] = [
  new Dragonair(),
  new Dragonite(),
  new Dratini(),
  new Gastly(),
  new Gengar(),
  new MultiTechnicalMachine01(),
  new PokemonNurse(),

  // Other prints
  new CopycatEX(),
  new EnergySearchEX(),
  new ProfessorElmsTrainingMethodEX(),
  new ProfessorOaksResearchEX(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
];
