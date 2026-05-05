import { Card } from '../../game/store/card/card';
import { AntiqueShieldFossil } from './antique-shield-fossil';
import { AntiqueSkullFossil } from './antique-skull-fossil';
import { Bastiodon } from './bastiodon';
import { ChiYu } from './chi-yu';
import { Cranidos } from './cranidos';
import { DarkBell } from './dark-bell';
import { Drilbur } from './drilbur';
import { FossilExcavationSite } from './fossil-excavation-site';
import { Inkay } from './inkay';
import { Malamar } from './malamar';
import { MegaDarkraiex } from './mega-darkrai-ex';
import { MegaExcadrillex } from './mega-excadrill-ex';
import { Nickit } from './nickit';
import { Rampardosex } from './rampardos-ex';
import { Relicanth } from './relicanth';
import { ShadowDarknessEnergy } from './shadow-darkness-energy';
import { Shieldon } from './shieldon';
import { Slowbro } from './slowbro';
import { Slowpoke } from './slowpoke';
import { Thievul } from './thievul';
import { Zarude } from './zarude';

export const setPitchBlack: Card[] = [
  new MegaDarkraiex(),
  new DarkBell(),
  new Inkay(),
  new Malamar(),
  new Zarude(),
  new ChiYu(),
  new ShadowDarknessEnergy(),
  new Drilbur(),
  new MegaExcadrillex(),
  new Slowpoke(),
  new Slowbro(),
  new Nickit(),
  new Thievul(),
  new Relicanth(),
  new Cranidos(),
  new Rampardosex(),
  new Shieldon(),
  new Bastiodon(),
  new AntiqueSkullFossil(),
  new AntiqueShieldFossil(),
  new FossilExcavationSite(),
];
