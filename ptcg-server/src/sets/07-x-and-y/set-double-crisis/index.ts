import { Card } from '../../../game/store/card/card';
import { TeamAquasGreatBall } from './team-aquas-great-ball';
import { TeamAquasSealeo } from './team-aquas-sealeo';
import { TeamAquasSpheal } from './team-aquas-spheal';
import { TeamMagmasGreatBall } from './team-magmas-great-ball';
import { TeamMagmasSecretBase } from './team-magmas-secret-base';

// Other prints
import { TeamAquasSecretBase } from './other-prints';

export const setDoubleCrisis: Card[] = [
  new TeamAquasGreatBall(),
  new TeamAquasSealeo(),
  new TeamAquasSpheal(),
  new TeamMagmasGreatBall(),
  new TeamMagmasSecretBase(),

  // Other prints
  new TeamAquasSecretBase(),
];