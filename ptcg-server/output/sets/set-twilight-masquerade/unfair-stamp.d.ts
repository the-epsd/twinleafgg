import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
export declare class UnfairStamp extends TrainerCard {
    trainerType: TrainerType;
    tags: CardTag[];
    set: string;
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    text: string;
    readonly UNFAIR_STAMP_MARKER = "UNFAIR_STAMP_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
