import { Power, State, StoreLike } from '../../..';
import { Effect } from '../effects/effect';
import { Card } from './card';
import { Format, SuperType, TrainerType } from './card-types';
export declare abstract class TrainerCard extends Card {
    superType: SuperType;
    trainerType: TrainerType;
    format: Format;
    text: string;
    powers: Power[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
