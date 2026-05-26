import { Format } from './card-types';
import { TrainerCard } from './trainer-card';
import { StoreLike } from '../store-like';
import { State } from '../state/state';
import { Effect } from '../effects/effect';
export declare function getOverriddenReduceEffect(card: TrainerCard, format: Format): ((store: StoreLike, state: State, effect: Effect) => State) | undefined;
