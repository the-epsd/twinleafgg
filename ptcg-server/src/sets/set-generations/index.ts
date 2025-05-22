import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy, DarknessEnergy, MetalEnergy, FairyEnergy } from './basic-energies';
import { Charmeleon } from './charmeleon';
import { MaxRevive } from './max-revive';
import { RedCard } from './red-card';
import { Revitalizer } from './revitalizer';
import { TeamFlareGrunt } from './team-flare-grunt';

export const setGenerations: Card[] = [
  new MaxRevive(),
  new RedCard(),
  new Revitalizer(),
  new TeamFlareGrunt(),

  // FA/Radiant Collection
  new Charmeleon(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
  new DarknessEnergy(),
  new MetalEnergy(),
  new FairyEnergy(),
];
