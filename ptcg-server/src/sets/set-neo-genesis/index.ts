import { Card } from '../../game/store/card/card';
import { BillsTeleporter } from './bills-teleporter';
import { Cleffa } from './cleffa';
import { Mary } from './mary';
import { Pichu } from './pichu';
import { ProfessorElm } from './professor-elm';
import { Sneasel } from './sneasel';

// Other prints
import {
  MetalEnergyN1,
  RecycleEnergyN1,
  SuperEnergyRetrieval
} from './other-prints';

export const setNeoGenesis: Card[] = [
  new BillsTeleporter(),
  new Cleffa(),
  new Mary(),
  new Pichu(),
  new ProfessorElm(),
  new Sneasel(),

  // Other prints
  new MetalEnergyN1(),
  new RecycleEnergyN1(),
  new SuperEnergyRetrieval(),
];
