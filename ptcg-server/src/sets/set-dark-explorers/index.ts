import { Card } from '../../game/store/card/card';
import { Accelgor } from './accelgor';
import { DarkClaw } from './dark-claw';
import { DarkraiEx } from './darkrai-ex';
import { Empoleon } from './empoleon';
import { Gardevoir } from './gardevoir';
import { Ivysaur } from './ivysaur';
import { Minun } from './minun';
import { Piplup } from './piplup';
import { Prinplup } from './prinplup';
import { RaikouEx } from './raikou-ex';
import { RandomReceiver } from './random-receiver';
import { Sableye } from './sableye';
import { Shelmet } from './shelmet';
import { TornadusEx } from './tornadus-ex';
import { TwistMountain } from './twist-mountain';
import { Tynamo } from './tynamo';
import { Yamask } from './yamask';
import { Zorua } from './zorua';

import {
  DarkPatchDEX,
  EnhancedHammerDEX,
  RareCandyDEX,
} from './other-prints';

export const setDarkExplorers: Card[] = [
  new Accelgor(),
  new DarkClaw(),
  new DarkraiEx(),
  new Empoleon(),
  new Gardevoir(),
  new Ivysaur(),
  new Minun(),
  new Piplup(),
  new Prinplup(),
  new RaikouEx(),
  new RandomReceiver(),
  new Sableye(),
  new Shelmet(),
  new TornadusEx(),
  new TwistMountain(),
  new Tynamo(),
  new Yamask(),
  new Zorua(),

  // Other Prints
  new DarkPatchDEX(),
  new EnhancedHammerDEX(),
  new RareCandyDEX(),
];
