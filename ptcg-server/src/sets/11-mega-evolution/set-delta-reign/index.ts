import { Card } from '../../../game/store/card/card';
import { AdventuringLantern } from './adventuring-lantern';
import { Fletchinder } from './fletchinder';
import { Fletchling } from './fletchling';
import { MegaRayquazaCap } from './mega-rayquaza-cap';
import { MegaRayquazaex } from './mega-rayquaza-ex';
import { Talonflameex } from './talonflame-ex';
import { ZinniasTrust } from './zinnias-trust';
import { EmceesHypeM6 } from './other-prints';
import { LegendarySummitLeft } from './legendary-summit-left';
import { LegendarySummitRight } from './legendary-summit-right';

export const setDeltaReign: Card[] = [
  new MegaRayquazaex(),
  new Fletchling(),
  new Fletchinder(),
  new Talonflameex(),
  new AdventuringLantern(),
  new MegaRayquazaCap(),
  new EmceesHypeM6(),
  new ZinniasTrust(),
  new LegendarySummitLeft(),
  new LegendarySummitRight(),
];
