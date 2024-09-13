import { Card } from '../../game/store/card/card';
import { BallGuyArt, BuizelArt, FrosmothArt, GalarianWeezingArt, HorseaArt, KoffingArt, RillaboomArt, RookideeArt, SnomArt, ThwackeyArt } from './card-images';
import { ApplinArt, SnomSVArt } from './full-art';

export const setShiningFates: Card[] = [
  new BallGuyArt(),
  new BuizelArt(),
  new FrosmothArt(),
  new GalarianWeezingArt(),
  new HorseaArt(),
  new KoffingArt(),
  new RillaboomArt(),
  new RookideeArt(),
  new SnomArt(),
  new ThwackeyArt(),

  // Shiny Vault

  new ApplinArt(),
  new SnomSVArt(),
];