import { Card } from '../../game/store/card/card';
import { BattleVIPPass } from './battle-vip-pass';
import { GenesectV } from './genesect-v';
import { MewV } from './mew-v';
import { MewVMAX } from './mew-vmax';
import { Oricorio } from './oricorio';
export const setFusionStrike: Card[] = [
  new MewV(),
  new MewVMAX(),
  new GenesectV(),
  new Oricorio(),
  new BattleVIPPass(),
];