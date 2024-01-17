import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ForestSealStone extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
