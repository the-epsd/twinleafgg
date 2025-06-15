import { Card } from '../../game/store/card/card';
import { Blissey } from './blissey';
import { BoostEnergy } from './boost-energy';
import { Chansey } from './chansey';
import { Magnemite } from './magnemite';

// Other prints
import { MetalEnergySpecialAQ } from './other-prints';
import { PokemonFanClubAQ } from './other-prints';
import { RainbowEnergyAQ } from './other-prints';
import { WarpEnergyAQ } from './other-prints';

export const setAquapolis: Card[] = [
  new Blissey(),
  new BoostEnergy(),
  new Chansey(),
  new Magnemite(),

  // Other prints
  new MetalEnergySpecialAQ(),
  new PokemonFanClubAQ(),
  new RainbowEnergyAQ(),
  new WarpEnergyAQ(),
];
