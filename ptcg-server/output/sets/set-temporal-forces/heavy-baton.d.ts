import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class HeavyBaton extends TrainerCard {
    regulationMark: string;
    trainerType: TrainerType;
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    text: string;
    readonly HEAVY_BATON_MARKER = "HEAVY_BATON_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
