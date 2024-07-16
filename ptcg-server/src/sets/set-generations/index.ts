import { Card } from '../../game/store/card/card';
import { RedCardArt, RevitalizerArt } from './card-images';
import { CharmeleonArt } from './full-art';

export const setGenerations: Card[] = [
  new RedCardArt(),
  new RevitalizerArt(),

  // Full Arts/Radiant Collection

  new CharmeleonArt()
];
