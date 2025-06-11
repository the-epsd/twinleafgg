import { Card } from '../../game/store/card/card';
import { BillsTeleporter } from './bills-teleporter';
import { Mary } from './mary';
import { ProfessorElm } from './professor-elm';
import { SuperEnergyRetrieval } from './other-prints';

export const setNeoGenesis: Card[] = [
  new BillsTeleporter(),
  new Mary(),
  new ProfessorElm(),
  new SuperEnergyRetrieval(),
];
