import { SizzlipedeCPA, PurrloinCPA, BedeCPA, FullHealCPA, GreatBallCPA, HopCPA, PokeBallCPA, PotionCPA, ProfessorsResearchCPA, Hop2CPA, Piers2CPA } from './other-prints';
import { Card } from '../../game/store/card/card';
import { EldegossV } from './eldegoss-v';
import { GalarianObstagoon } from './galarian-obstagoon';
import { Nickit } from './nickit';
import { Piers } from './piers';
import { RotomPhone } from './rotom-phone';
import { Sonia } from './sonia';
import { TurffieldStadium } from './turffield-stadium';
import { Weedle } from './weedle';

// other prints
import { MarnieCPA } from './other-prints';

export const setChampionsPath: Card[] = [
  new EldegossV(),
  new GalarianObstagoon(),
  new Nickit(),
  new Piers(),
  new RotomPhone(),
  new Sonia(),
  new TurffieldStadium(),
  new Weedle(),

  // other prints
  new MarnieCPA(),
  new SizzlipedeCPA(),
  new PurrloinCPA(),
  new BedeCPA(),
  new FullHealCPA(),
  new GreatBallCPA(),
  new HopCPA(),
  new PokeBallCPA(),
  new PotionCPA(),
  new ProfessorsResearchCPA(),
  new Hop2CPA(),
  new Piers2CPA(),
];
