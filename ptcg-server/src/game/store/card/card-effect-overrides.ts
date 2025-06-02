import { Format } from './card-types';
import { TrainerCard } from './trainer-card';
import { StoreLike } from '../store-like';
import { State } from '../state/state';
import { Effect } from '../effects/effect';

import { GreatBall as GreatBallRG } from '../../../sets/set-ex-firered-leafgreen/great-ball';
import { GreatBall as GreatBallPAL } from '../../../sets/set-paldea-evolved/great-ball';
import { QuickBall as QuickBallMD } from '../../../sets/set-majestic-dawn/quick-ball';
import { QuickBall as QuickBallSSH } from '../../../sets/set-sword-and-shield/quick-ball';
import { SuperRod as SuperRodNVI } from '../../../sets/set-noble-victories/super-rod';
import { SuperRod as SuperRodPAL } from '../../../sets/set-paldea-evolved/super-rod';

const effectOverrides: {
  [cardKey: string]: {
    [format: number]: (this: TrainerCard, store: StoreLike, state: State, effect: Effect) => State
  } & {
    default?: (this: TrainerCard, store: StoreLike, state: State, effect: Effect) => State
  }
} = {
  'Great Ball': {
    [Format.RSPK]: GreatBallRG.prototype.reduceEffect,
    default: GreatBallPAL.prototype.reduceEffect
  },
  'Quick Ball': {
    [Format.UNLIMITED]: QuickBallMD.prototype.reduceEffect,
    default: QuickBallSSH.prototype.reduceEffect
  },
  'Super Rod': {
    [Format.UNLIMITED]: SuperRodNVI.prototype.reduceEffect,
    default: SuperRodPAL.prototype.reduceEffect
  }
};

export function getOverriddenReduceEffect(card: TrainerCard, format: Format) {
  const key = `${card.name}`;
  const overrides = effectOverrides[key];
  if (overrides) {
    if (overrides[format]) {
      return overrides[format].bind(card);
    }
    if (overrides.default) {
      return overrides.default.bind(card);
    }
  }
  return undefined;
} 