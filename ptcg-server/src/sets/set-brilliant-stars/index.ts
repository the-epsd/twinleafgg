import { Card } from '../../game/store/card/card';
import { ArceusVSTAR } from './arceus-vstar';
import { Bibarel } from './bibarel';
import { CollapsedStadium } from './collapsed-stadium';
import { Manaphy } from './manaphy';

export const setBrilliantStars: Card[] = [
  new CollapsedStadium(),
  new Manaphy(),
  new Bibarel(),
  new ArceusVSTAR()
];
