import { State, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Volkner extends TrainerCard {
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    trainerType: TrainerType;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
