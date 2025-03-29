import { Card } from '../../game/store/card/card';
import { BallGuy } from './ball-guy';
import { Buizel } from './buizel';
import { Dartrix } from './dartrix';
import { ApplinSV, SnomSV } from './full-art';
import { GalarianWeezing } from './galarian-weezing';
import { Horsea } from './horsea';
import { Koffing } from './koffing';
import { Kyogre } from './kyogre';
import { FrosmothSHF } from './other-prints';
import { Reshiram } from './reshiram';
import { Rillaboom } from './rillaboom';
import { Snom } from './snom';
import { Thwackey } from './thwackey';
import { Yveltal } from './yveltal';

export const setShiningFates: Card[] = [
  new BallGuy(),
  new Buizel(),
  new Dartrix(),
  new FrosmothSHF(),
  new GalarianWeezing(),
  new Horsea(),
  new Koffing(),
  new Rillaboom(),
  new Snom(),
  new Thwackey(),
  new Reshiram(),
  new Kyogre(),
  new Yveltal(),

  // Shiny Vault
  new ApplinSV(),
  new SnomSV(),
];