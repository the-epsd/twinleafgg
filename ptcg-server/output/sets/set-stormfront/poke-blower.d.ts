import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class PokeBlower extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
