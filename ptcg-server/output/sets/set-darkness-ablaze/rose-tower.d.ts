import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class RoseTower extends TrainerCard {
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    trainerType: TrainerType;
    set: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State;
}
