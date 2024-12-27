import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
export declare class Rosa extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    name: string;
    fullName: string;
    setNumber: string;
    text: string;
    readonly ROSA_MARKER = "ROSA_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
