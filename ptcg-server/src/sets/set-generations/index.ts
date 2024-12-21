import { Card } from '../../game/store/card/card';
import { Charmeleon } from './charmeleon';
import { RedCard } from './red-card';
import { Revitalizer } from './revitalizer';
import { TeamFlareGrunt } from './team-flare-grunt';

export const setGenerations: Card[] = [
  new RedCard(),
  new Revitalizer(),
  new TeamFlareGrunt(),

  // Full s/Radiant Collection
  new Charmeleon(),
];
