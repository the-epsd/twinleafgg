import { Card } from '../../game/store/card/card';
import { BallGuyArt, BuizelArt, FrosmothArt, GalarianWeezingArt, KoffingArt, RillaboomArt, SnomArt, ThwackeyArt } from './card-images';
import { ApplinArt, SnomSVArt } from './full-art';
import { Horsea } from './horsea';


export const setShiningFates: Card[] = [
  new BallGuyArt(),
  new BuizelArt(),
  new FrosmothArt(),
  new GalarianWeezingArt(),
  new Horsea(),
  new KoffingArt(),
  new RillaboomArt(),
  new SnomArt(),
  new ThwackeyArt(),

  // Shiny Vault

  new ApplinArt(),
  new SnomSVArt(),
];