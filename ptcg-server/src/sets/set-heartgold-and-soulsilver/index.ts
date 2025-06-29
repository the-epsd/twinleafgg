import { Card } from '../../game/store/card/card';
import { Cleffa } from './cleffa';
import { Cyndaquil } from './cyndaquil';
import { Drowzee } from './drowzee';
import { GrassEnergy } from './grass-energy';
import { Hoppip } from './hoppip';
import { Jumpluff } from './jumpluff';
import { FireEnergy } from './fire-energy';
import { WaterEnergy } from './water-energy';
import { LightningEnergy } from './lightning-energy';
import { PsychicEnergy } from './psychic-energy';
import { FightingEnergy } from './fighting-energy';
import { DarknessEnergy } from './darkness-energy';
import { MetalEnergy } from './metal-energy';
import { Ninetales } from './ninetales';
import { Hypno } from './hypno';
import { Pichu } from './pichu';
import { PokemonCollector } from './pokemon-collector';
import { ProfessorOaksNewTheory } from './professor-oaks-new-theory';
import { Quilava } from './quilava';
import { Typhlosion } from './typhlosion';
import { Tyrogue } from './tyrogue';
import { Unown } from './unown';
import { Vulpix } from './vulpix';

// Other prints
import {
  DoubleColorlessEnergyHS,
  Pokegear30HS,
  PokemonCommunicationHS,
  PokemonReversalHS,
  SwitchHS,
} from './other-prints';

export const setHeartGoldAndSoulSilver: Card[] = [
  new Cleffa(),
  new Cyndaquil(),
  new DarknessEnergy(),
  new Drowzee(),
  new FightingEnergy(),
  new FireEnergy(),
  new GrassEnergy(),
  new Hoppip(),
  new Hypno(),
  new Jumpluff(),
  new LightningEnergy(),
  new MetalEnergy(),
  new Ninetales(),
  new Pichu(),
  new PokemonCollector(),
  new ProfessorOaksNewTheory(),
  new PsychicEnergy(),
  new Quilava(),
  new Typhlosion(),
  new Tyrogue(),
  new Unown(),
  new Vulpix(),
  new WaterEnergy(),

  // Other prints
  new DoubleColorlessEnergyHS(),
  new Pokegear30HS(),
  new PokemonCommunicationHS(),
  new PokemonReversalHS(),
  new SwitchHS(),
];
