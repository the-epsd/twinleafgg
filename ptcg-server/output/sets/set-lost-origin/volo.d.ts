import { TrainerCard, TrainerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Volo extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
