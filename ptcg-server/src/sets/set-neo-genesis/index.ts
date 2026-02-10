import { Card } from '../../game/store/card/card';
import { BillsTeleporter } from './bills-teleporter';
import { Cleffa } from './cleffa';
import { DarknessEnergySpecial } from './darkness-energy-special';
import { DoubleGust } from './double-gust';
import { Hoothoot } from './hoothoot';
import { Hoppip } from './hoppip';
import { Mary } from './mary';
import { Natu } from './natu';
import { Noctowl } from './noctowl';
import { Pichu } from './pichu';
import { ProfessorElm } from './professor-elm';
import { Sneasel } from './sneasel';
import { Steelix } from './steelix';
import { Totodile } from './totodile';

// Other prints
import {
  MetalEnergyN1,
  RecycleEnergyN1,
  SuperEnergyRetrieval
} from './other-prints';

export const setNeoGenesis: Card[] = [
  new BillsTeleporter(),
  new Cleffa(),
  new DarknessEnergySpecial(),
  new DoubleGust(),
  new Hoothoot(),
  new Hoppip(),
  new Mary(),
  new Natu(),
  new Noctowl(),
  new Pichu(),
  new ProfessorElm(),
  new Sneasel(),
  new Steelix(),
  new Totodile(),

  // Other prints
  new MetalEnergyN1(),
  new RecycleEnergyN1(),
  new SuperEnergyRetrieval(),
];
