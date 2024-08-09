import { Card } from '../../game/store/card/card';
import { DarknessEnergyArt, DevolutionSprayArt, ElectabuzzArt, PokedexArt, PoliwhirlArt, StarmieArt } from './card-images';

export const setEvolutions: Card[] = [
  new DevolutionSprayArt(),
  new ElectabuzzArt(),
  new PokedexArt(),
  new PoliwhirlArt(),
  new StarmieArt(),

  //Energy
  new DarknessEnergyArt(),
];
