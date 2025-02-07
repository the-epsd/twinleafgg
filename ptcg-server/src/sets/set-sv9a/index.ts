import { Card } from '../../game/store/card/card';
import { EthansAdventure } from './ethans-adventure';
import { EthansCyndaquil } from './ethans-cyndaquil';
import { EthansHoOhex } from './ethans-ho-oh-ex';
import { EthansMagcargo } from './ethans-magcargo';
import { EthansPichu } from './ethans-pichu';
import { EthansQuilava } from './ethans-quilava';
import { EthansSlugma } from './ethans-slugma';
import { EthansTyphlosion } from './ethans-typhlosion';
import { MistysGyarados } from './mistys-gyarados';
import { MistysMagikarp } from './mistys-magikarp';
import { MistysPsyduck } from './mistys-psyduck';
import { SacredAshSV9a } from './other-prints';

export const setSV9a: Card[] = [
  new EthansAdventure(),
  new EthansHoOhex(),

  new EthansCyndaquil(),
  new EthansQuilava(),
  new EthansTyphlosion(),
  new EthansSlugma(),
  new EthansMagcargo(),
  new EthansPichu(),

  new MistysPsyduck(),
  new MistysMagikarp(),
  new MistysGyarados(),

  // Reprints
  new SacredAshSV9a(),
];
