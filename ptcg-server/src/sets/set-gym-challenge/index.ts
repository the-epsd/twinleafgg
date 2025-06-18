import { Card } from '../../game/store/card/card';
import { BlainesRapidash } from './blaine-rapidash';
import { ChaosGym } from './chaos-gym';
import { MistysPoliwag } from './mistys-poliwag';
import { RocketsZapdos } from './rockets-zapdos';

export const setGymChallenge: Card[] = [
  new BlainesRapidash(),
  new ChaosGym(),
  new MistysPoliwag(),
  new RocketsZapdos(),
];
