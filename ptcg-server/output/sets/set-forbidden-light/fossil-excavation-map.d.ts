import { TrainerCard, TrainerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class FossilExcavationMap extends TrainerCard {
    trainerType: TrainerType;
    cardImage: string;
    setNumber: string;
    set: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
