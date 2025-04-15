import { Card } from '../../game/store/card/card';
import { BillsTeleporter } from './bills-teleporter';
import { Mary } from './mary';
import { ProfessorElm } from './professor-elm';

export const setNeoGenesis: Card[] = [
  new BillsTeleporter(),
  new Mary(),
  new ProfessorElm(),
];
