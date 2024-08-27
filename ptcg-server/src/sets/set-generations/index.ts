import { Card } from '../../game/store/card/card';
import { RedCardArt, RevitalizerArt, TeamFlareGruntArt } from './card-images';
import { CharmeleonArt } from './full-art';

export const setGenerations: Card[] = [
  new RedCardArt(),
  new RevitalizerArt(),
  new TeamFlareGruntArt(),
  
  // Full Arts/Radiant Collection
  new CharmeleonArt(),
];
