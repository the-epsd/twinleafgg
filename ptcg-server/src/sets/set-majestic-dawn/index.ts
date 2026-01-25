import { DuskBallMD, PokeBallMD, SuperScoopUpMD, EnergySearchMD, DarknessEnergySpecialMD, MetalEnergyN1MD } from './other-prints';
import { Card } from '../../game/store/card/card';
import { Bronzong } from './bronzong';
import { Bronzor } from './bronzor';
import { Buneary } from './buneary';
import { CallEnergy } from './call-energy';
import { Chatot } from './chatot';
import { Croagunk } from './croagunk';
import { Darkrai } from './darkrai';
import { Empoleon } from './empoleon';
import { Prinplup } from './prinplup';
import { QuickBall } from './quick-ball';
import { Scizor } from './scizor';
import { Scyther } from './scyther';
import { Toxicroak } from './toxicroak';
import { UnownP } from './unown-p';
import { UnownQ } from './unown-q';

// Other prints
import { WarpPointMD } from './other-prints';

export const setMajesticDawn: Card[] = [
  new Bronzong(),
  new Bronzor(),
  new Buneary(),
  new CallEnergy(),
  new Chatot(),
  new Croagunk(),
  new Darkrai(),
  new Empoleon(),
  new Prinplup(),
  new QuickBall(),
  new Scizor(),
  new Scyther(),
  new Toxicroak(),
  new UnownP(),
  new UnownQ(),

  // Other prints
  new WarpPointMD(),
  new DuskBallMD(),
  new PokeBallMD(),
  new SuperScoopUpMD(),
  new EnergySearchMD(),
  new DarknessEnergySpecialMD(),
  new MetalEnergyN1MD(),
];
