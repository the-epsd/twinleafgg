import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class AmuletofHope extends TrainerCard {
    tags: CardTag[];
    trainerType: TrainerType;
    set: string;
    setNumber: string;
    cardImage: string;
    regulationMark: string;
    name: string;
    fullName: string;
    text: string;
    readonly AMULET_OF_HOPE_MARKER = "AMULET_OF_HOPE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
