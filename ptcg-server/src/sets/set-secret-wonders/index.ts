import { BebesSearchSW, PlusPowerSW, PotionSW, SwitchSW, DarknessEnergySpecialSW, MetalEnergyN1SW } from './other-prints';
import { Card } from '../../game/store/card/card';
import { Duskull } from './duskull';
import { Gallade } from './gallade';
import { Gardevoir } from './gardevoir';
import { GardevoirLVX } from './gardevoir-lv-x';
import { Hoppip } from './hoppip';
import { Kirlia } from './kirlia';
import { Mew } from './mew';
import { Minun } from './minun';
import { Pidgeotto } from './pidgeotto';
import { Pidgey } from './pidgey';
import { Plusle } from './plusle';
import { Ralts } from './ralts';
import { RoseannesResearch } from './roseannes-research';
import { Skiploom } from './skiploom';

// Other Prints
import { NightMaintenanceSW } from './other-prints';

export const setSecretWonders: Card[] = [
  new Duskull(),
  new Gallade(),
  new Mew(),
  new Minun(),
  new Pidgeotto(),
  new Pidgey(),
  new Plusle(),
  new Ralts(),
  new Kirlia(),
  new Gardevoir(),
  new GardevoirLVX(),
  new Hoppip(),
  new RoseannesResearch(),
  new Skiploom(),

  // Other Prints
  new NightMaintenanceSW(),
  new BebesSearchSW(),
  new PlusPowerSW(),
  new PotionSW(),
  new SwitchSW(),
  new DarknessEnergySpecialSW(),
  new MetalEnergyN1SW(),
];