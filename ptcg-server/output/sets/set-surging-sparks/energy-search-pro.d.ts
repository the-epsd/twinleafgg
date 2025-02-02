import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
export declare class EnergySearchPro extends TrainerCard {
    tags: CardTag[];
    trainerType: TrainerType;
    regulationMark: string;
    setNumber: string;
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
