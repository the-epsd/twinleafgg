import { Card } from '../../game/store/card/card';
import { ChiYu } from './chi-yu';
import { DarkBell } from './dark-bell';
import { Inkay } from './inkay';
import { Malamar } from './malamar';
import { MegaDarkraiex } from './mega-darkrai-ex';
import { ShadowDarknessEnergy } from './shadow-darkness-energy';
import { Zarude } from './zarude';

export const setPitchBlack: Card[] = [
  new MegaDarkraiex(),
  new DarkBell(),
  new Inkay(),
  new Malamar(),
  new Zarude(),
  new ChiYu(),
  new ShadowDarknessEnergy(),
];
