import { State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class SupereffectiveGlasses extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
