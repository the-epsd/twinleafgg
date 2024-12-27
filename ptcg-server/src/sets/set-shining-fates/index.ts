import { Card } from '../../game/store/card/card';
import { BallGuy } from './ball-guy';
import { Buizel } from './buizel';
import { Dartrix } from './dartrix';
import { ApplinSV, SnomSV } from './full-art';
import { GalarianWeezing } from './galarian-weezing';
import { Horsea } from './horsea';
import { Koffing } from './koffing';
import { FrosmothSHF } from './other-prints';
import { Rillaboom } from './rillaboom';
import { Rookidee } from './rookidee';
import { Snom } from './snom';
import { Thwackey } from './thwackey';
export const setShiningFates: Card[] = [
  new BallGuy(),
  new Buizel(),
  new Dartrix(),
  new FrosmothSHF(),
  new GalarianWeezing(),
  new Horsea(),
  new Koffing(),
  new Rillaboom(),
  new Rookidee(),
  new Snom(),
  new Thwackey(),

  // Shiny Vault
  new ApplinSV(),
  new SnomSV(),
];