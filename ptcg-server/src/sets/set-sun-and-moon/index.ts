import { Card } from '../../game/store/card/card';
import { EnergyRetrieval } from './energy-retrieval';
import { ExpShare } from './exp-share';
import { RainbowEnergy } from './rainbow-energy';
import { RareCandy } from './rare-candy';

export const setSunAndMoon: Card[] = [
  new EnergyRetrieval(),
  new ExpShare(),
  new RainbowEnergy(),
  new RareCandy(),

];
