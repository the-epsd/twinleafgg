import { Card } from '../../game/store/card/card';
import { BattleVIPPass } from './battle-vip-pass';
import { GenesectV } from './genesect-v';
import { Judge } from './judge';
import { MewV } from './mew-v';
import { MewVMAX } from './mew-vmax';
import { Oricorio } from './oricorio';
import { Yveltal } from './yveltal';
export const setFusionStrike: Card[] = [
  new MewV(),
  new MewVMAX(),
  new GenesectV(),
  new Oricorio(),
  new BattleVIPPass(),
  new Judge(),
  new Yveltal(),
];