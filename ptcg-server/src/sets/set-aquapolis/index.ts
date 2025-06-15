import { Card } from '../../game/store/card/card';
import { Blissey } from './blissey';
import { BoostEnergy } from './boost-energy';
import { Chansey } from './chansey';
import { Eevee } from './eevee';
import { Espeon } from './espeon';
import { Horsea } from './horsea';
import { Kingdra } from './kingdra';
import { Magnemite } from './magnemite';
import { Seadra } from './seadra';
import { SuperEnergyRemoval2 } from './super-energy-removal-2';
import { Zapdos } from './zapdos';

// Other prints
import { MetalEnergySpecialAQ } from './other-prints';
import { PokemonFanClubAQ } from './other-prints';
import { RainbowEnergyAQ } from './other-prints';
import { WarpEnergyAQ } from './other-prints';

export const setAquapolis: Card[] = [
  new Blissey(),
  new BoostEnergy(),
  new Chansey(),
  new Eevee(),
  new Espeon(),
  new Horsea(),
  new Kingdra(),
  new Magnemite(),
  new Seadra(),
  new SuperEnergyRemoval2(),
  new Zapdos(),

  // Other prints
  new MetalEnergySpecialAQ(),
  new PokemonFanClubAQ(),
  new RainbowEnergyAQ(),
  new WarpEnergyAQ(),
];
