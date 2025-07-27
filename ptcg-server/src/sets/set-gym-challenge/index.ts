import { Card } from '../../game/store/card/card';
import { BlainesRapidash } from './blaine-rapidash';
import { ChaosGym } from './chaos-gym';
import { MistysPoliwag } from './mistys-poliwag';
import { ResistanceGym } from './resistance-gym';
import { RocketsZapdos } from './rockets-zapdos';
import { TransparentWalls } from './transparent-walls';

// Other prints
import { WarpPointG2 } from './other-prints';

export const setGymChallenge: Card[] = [
  new BlainesRapidash(),
  new ChaosGym(),
  new MistysPoliwag(),
  new ResistanceGym(),
  new RocketsZapdos(),
  new TransparentWalls(),

  // Other prints
  new WarpPointG2(),
];
