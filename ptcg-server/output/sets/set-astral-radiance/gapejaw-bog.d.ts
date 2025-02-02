import { State, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
export declare class GapejawBog extends TrainerCard {
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    trainerType: TrainerType;
    set: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
