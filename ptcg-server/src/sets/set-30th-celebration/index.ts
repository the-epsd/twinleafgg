import { Card } from '../../game/store/card/card';
import { Cherubi } from './cherubi';
import { Cherrim } from './cherrim';
import { Eevee } from './eevee';
import { Espeon } from './espeon';
import { Espeonex } from './espeon-ex';
import { Sylveonex } from './sylveon-ex';
import { Greninjaex } from './greninja-ex';
import { Mewex } from './mew-ex';
import { Mewtwoex } from './mewtwo-ex';
import { Eevee118 } from './other-prints';
import { Umbreon } from './umbreon';
import { Umbreonex } from './umbreon-ex';
import { Victini } from './victini';
import { Zorua } from './zorua';
import { Zoroark } from './zoroark';
import { Zeraora } from './zeraora';
import { DarknessEnergyArt, FightingEnergyArt, FireEnergyArt, GrassEnergyArt, LightningEnergyArt, MetalEnergyArt, PsychicEnergyArt, WaterEnergyArt } from './energy-art';

export const set30thCelebration: Card[] = [
  new Cherubi(),
  new Cherrim(),
  new Victini(),
  new Greninjaex(),
  new Zeraora(),
  new Espeon(),
  new Mewex(),
  new Mewtwoex(),
  new Espeonex(),
  new Sylveonex(),
  new Umbreon(),
  new Umbreonex(),
  new Eevee(),
  new Eevee118(),
  new Zorua(),
  new Zoroark(),

  // Energy Art
  new GrassEnergyArt(),
  new FireEnergyArt(),
  new WaterEnergyArt(),
  new LightningEnergyArt(),
  new PsychicEnergyArt(),
  new FightingEnergyArt(),
  new DarknessEnergyArt(),
  new MetalEnergyArt(),
];
