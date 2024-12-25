import { Card } from '../../game/store/card/card';
import { GalarianObstagoon } from './galarian-obstagoon';
import { Piers } from './piers';
import { RotomPhone } from './rotom-phone';
import { Sonia } from './sonia';
import { TurffieldStadium } from './turffield-stadium';

export const setChampionsPath: Card[] = [
  new GalarianObstagoon(),
  new Piers(),
  new RotomPhone(),
  new Sonia(),
  new TurffieldStadium()
];
