import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class RebootPod extends TrainerCard {
    trainerType: TrainerType;
    tags: CardTag[];
    regulationMark: string;
    set: string;
    name: string;
    cardImage: string;
    setNumber: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
