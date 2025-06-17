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
import { Gastly } from './gastly';
import { Gengar } from './gengar';
import { Ivysaur } from './ivysaur';
import { MultiTechnicalMachine01 } from './multi-technical-machine-01';
import { PokemonNurse } from './pokemon-nurse';
import { Venusaur } from './venusaur';

// Other prints
import { CopycatEX } from './other-prints';
import { EnergySearchEX } from './other-prints';
import { ProfessorElmsTrainingMethodEX } from './other-prints';
import { ProfessorOaksResearchEX } from './other-prints';
import { SwitchEX } from './other-prints';

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
  new Gastly(),
  new Gengar(),
  new Ivysaur(),
  new MultiTechnicalMachine01(),
  new PokemonNurse(),
  new Venusaur(),

  // Other prints
  new CopycatEX(),
  new EnergySearchEX(),
  new ProfessorElmsTrainingMethodEX(),
  new ProfessorOaksResearchEX(),
  new SwitchEX(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
];
