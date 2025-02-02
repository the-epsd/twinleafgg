import { State, StoreLike, TrainerCard } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
export declare class Ether extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
