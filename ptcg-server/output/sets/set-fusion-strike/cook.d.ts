import { TrainerCard, TrainerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Cook extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    set2: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
