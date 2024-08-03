import { Card } from '../../game/store/card/card';
import { MarshadowArt, ShiningGenesectArt, ShiningMewArt, VenusaurArt, WarpEnergyArt } from './card-images';
import { Croconaw } from './croconaw';

export const setShiningLegends: Card[] = [
  new Croconaw(),
  new MarshadowArt(),
  new ShiningGenesectArt(),
  new ShiningMewArt(),
  new VenusaurArt(),
  new WarpEnergyArt()
];