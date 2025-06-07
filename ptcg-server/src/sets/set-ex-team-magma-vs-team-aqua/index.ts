import { Card } from '../../game';
import { DoubleRainbowEnergy } from './double-rainbow-energy';
import { Raikouex } from './raikou-ex';
import { Sceptileex } from './sceptile-ex';
import { TeamMagmasCamerupt } from './team-magmas-camerupt';
import { TeamMagmasGroudon } from './team-magmas-groudon';
import { TeamMagmasNumel } from './team-magmas-numel';

// Other prints
import { DualBallMA } from './other-prints';
import { WarpPointMA } from './other-prints';

export const setEXTeamMagmaVsTeamAqua: Card[] = [
  new DoubleRainbowEnergy(),
  new Raikouex(),
  new Sceptileex(),
  new TeamMagmasCamerupt(),
  new TeamMagmasGroudon(),
  new TeamMagmasNumel(),

  // Other prints
  new DualBallMA(),
  new WarpPointMA(),
];