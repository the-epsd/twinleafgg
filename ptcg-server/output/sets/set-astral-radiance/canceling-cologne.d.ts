import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class CancelingCologne extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    name: string;
    cardImage: string;
    setNumber: string;
    fullName: string;
    text: string;
    CANCELING_COLOGNE_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
