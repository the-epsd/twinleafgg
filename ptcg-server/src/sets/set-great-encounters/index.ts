import { LeftoversGE } from './other-prints';
import { Card } from '../../game/store/card/card';
import { Baltoy } from './baltoy';
import { Buizel } from './buizel';
import { Claydol } from './claydol';
import { DialgaLVX } from './dialga-lv-x';
import { FelicitysDrawing } from './felicitys-drawing';
import { Floatzel } from './floatzel';
import { Illumise } from './illumise';
import { MoonlightStadium } from './moonlight-stadium';
import { Porygon } from './porygon';
import { PremierBall } from './premier-ball';
import { UnownG } from './unown-g';
import { Volbeat } from './volbeat';
import { Weedle } from './weedle';

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
  new Porygon(),
  new PremierBall(),
  new UnownG(),
  new Volbeat(),
  new Weedle(),

  // Other prints
  new RareCandyGE(),
  new LeftoversGE(),
];
