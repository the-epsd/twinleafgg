import { Format } from './card-types';
import { TrainerCard } from './trainer-card';
import { StoreLike } from '../store-like';
import { State } from '../state/state';
import { Effect } from '../effects/effect';

import { QuickBall as QuickBallMD } from '../../../sets/set-majestic-dawn/quick-ball';
import { QuickBall as QuickBallSSH } from '../../../sets/set-sword-and-shield/quick-ball';

const effectOverrides: {
  [cardKey: string]: {
    [format: number]: (this: TrainerCard, store: StoreLike, state: State, effect: Effect) => State
  } & {
    default?: (this: TrainerCard, store: StoreLike, state: State, effect: Effect) => State
  }
} = {
  'Quick Ball': {
    [Format.UNLIMITED]: QuickBallMD.prototype.reduceEffect,
    default: QuickBallSSH.prototype.reduceEffect
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