import { Card } from '../../game/store/card/card';
import { Blissey } from './blissey';
import { BoostEnergy } from './boost-energy';
import { Chansey } from './chansey';
import { Chinchou } from './chinchou';
import { Chinchou2 } from './chinchou2';
import { Eevee } from './eevee';
import { Espeon } from './espeon';
import { Furret } from './furret';
import { Gloom } from './gloom';
import { Horsea } from './horsea';
import { Kingdra } from './kingdra';
import { Lugia } from './lugia';
import { Magnemite } from './magnemite';
import { MetalEnergySpecial } from './metal-energy-special';
import { Porygon } from './porygon';
import { Porygon2 } from './porygon2';
import { Seadra } from './seadra';
import { SuperEnergyRemoval2 } from './super-energy-removal-2';
import { TownVolunteers } from './town-volunteers';
import { WeaknessGuard } from './weakness-guard';
import { Zapdos } from './zapdos';

// Other prints
import { PokemonFanClubAQ } from './other-prints';
import { RainbowEnergyAQ } from './other-prints';
import { WarpEnergyAQ } from './other-prints';

export const setAquapolis: Card[] = [
  new Blissey(),
  new BoostEnergy(),
  new Chansey(),
  new Chinchou(),
  new Chinchou2(),
  new Eevee(),
  new Espeon(),
  new Furret(),
  new Gloom(),
  new Horsea(),
  new Kingdra(),
  new Lugia(),
  new Magnemite(),
  new MetalEnergySpecial(),
  new Porygon(),
  new Porygon2(),
  new Seadra(),
  new SuperEnergyRemoval2(),
  new TownVolunteers(),
  new WeaknessGuard(),
  new Zapdos(),

  // Other prints
  new PokemonFanClubAQ(),
  new RainbowEnergyAQ(),
  new WarpEnergyAQ(),
];
