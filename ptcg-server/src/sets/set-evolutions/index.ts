import { Card } from '../../game/store/card/card';
import { DarknessEnergyArt, DevolutionSprayArt, DragoniteEXArt, ElectabuzzArt, PokedexArt, PoliwhirlArt, StarmieArt } from './card-images';

export const setEvolutions: Card[] = [
  new DevolutionSprayArt(),
  new DragoniteEXArt(),
  new ElectabuzzArt(),
  new PokedexArt(),
  new PoliwhirlArt(),
  new StarmieArt(),

  //Energy
  new DarknessEnergyArt(),
];
