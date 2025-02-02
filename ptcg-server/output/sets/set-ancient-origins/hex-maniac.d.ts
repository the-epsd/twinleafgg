import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class HexManiac extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    setNumber: string;
    name: string;
    fullName: string;
    cardImage: string;
    text: string;
    HEX_MANIAC_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
