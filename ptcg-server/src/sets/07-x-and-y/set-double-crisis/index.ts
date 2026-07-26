import { Card } from '../../../game/store/card/card';
import { TeamAquasGreatBall } from './team-aquas-great-ball';
import { TeamMagmasGreatBall } from './team-magmas-great-ball';
import { TeamMagmasSecretBase } from './team-magmas-secret-base';

// Other prints
import { TeamAquasSecretBase } from './other-prints';

export const setDoubleCrisis: Card[] = [
  new TeamAquasGreatBall(),
  new TeamMagmasGreatBall(),
  new TeamMagmasSecretBase(),

  // Other prints
  new TeamAquasSecretBase(),
];