import { TrainerCard, StoreLike, State, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Test extends TrainerCard {
    regulationMark: string;
    trainerType: TrainerType;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
