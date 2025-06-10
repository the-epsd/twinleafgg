import { Card } from '../../game';
import { Archie } from './archie';
import { DoubleRainbowEnergy } from './double-rainbow-energy';
import { Raikouex } from './raikou-ex';
import { Sceptileex } from './sceptile-ex';
import { TeamAquaBall } from './team-aqua-ball';
import { TeamAquaHideout } from './team-aqua-hideout';
import { TeamAquasCacnea } from './team-aquas-cacnea';
import { TeamAquasCacturne } from './team-aquas-cacturne';
import { TeamAquasKyogre } from './team-aquas-kyogre';
import { TeamAquaTechnicalMachine01 } from './team-aqua-technical-machine-01';
import { TeamMagmasCamerupt } from './team-magmas-camerupt';
import { TeamMagmasGroudon } from './team-magmas-groudon';
import { TeamMagmasNumel } from './team-magmas-numel';

// Other prints
import { DualBallMA } from './other-prints';
import { WarpPointMA } from './other-prints';

export const setEXTeamMagmaVsTeamAqua: Card[] = [
  new Archie(),
  new DoubleRainbowEnergy(),
  new Raikouex(),
  new Sceptileex(),
  new TeamAquaBall(),
  new TeamAquaHideout(),
  new TeamAquasCacnea(),
  new TeamAquasCacturne(),
  new TeamAquasKyogre(),
  new TeamAquaTechnicalMachine01(),
  new TeamMagmasCamerupt(),
  new TeamMagmasGroudon(),
  new TeamMagmasNumel(),

  // Other prints
  new DualBallMA(),
  new WarpPointMA(),
];