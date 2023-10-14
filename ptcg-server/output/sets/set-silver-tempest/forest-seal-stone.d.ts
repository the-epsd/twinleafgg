import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game';
export declare class ForestSealStone extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    set2: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    readonly VSTAR_MARKER = "VSTAR_MARKER";
    text: string;
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
