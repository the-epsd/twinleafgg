import { Card } from '../../game/store/card/card';
import { Baltoy } from './baltoy';
import { Buizel } from './buizel';
import { Claydol } from './claydol';
import { DialgaLVX } from './dialga-lv-x';
import { FelicitysDrawing } from './felicitys-drawing';
import { Floatzel } from './floatzel';
import { Illumise } from './illumise';
import { MoonlightStadium } from './moonlight-stadium';
import { PremierBall } from './premier-ball';
import { Volbeat } from './volbeat';

// Other prints
import { RareCandyGE } from './other-prints';

export const setGreatEncounters: Card[] = [
  new Buizel(),
  new Floatzel(),
  new Baltoy(),
  new Claydol(),
  new DialgaLVX(),
  new FelicitysDrawing(),
  new Illumise(),
  new MoonlightStadium(),
  new PremierBall(),
  new Volbeat(),

  // Other prints
  new RareCandyGE()
];
