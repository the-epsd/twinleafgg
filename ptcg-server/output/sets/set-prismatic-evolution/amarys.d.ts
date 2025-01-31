import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Amarys extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    readonly AMARYS_USED_MARKER = "AMARYS_USED_MARKER";
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
