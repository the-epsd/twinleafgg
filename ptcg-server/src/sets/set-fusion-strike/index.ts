import { Card } from '../../game/store/card/card';
import { BattleVIPPass } from './battle-vip-pass';
import { CrossSwitcher } from './cross-switcher';
import { FusionStrikeEnergy } from './fusion-strike-energy';
import { GenesectV } from './genesect-v';
import { InteleonV } from './inteleon-v';
import { InteleonVMAX } from './inteleon-vmax';
import { Judge } from './judge';
import { Meloetta } from './meloetta';
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
  new CrossSwitcher(),
  new Meloetta(),
  new FusionStrikeEnergy(),
  new InteleonV(),
  new InteleonVMAX(),
];