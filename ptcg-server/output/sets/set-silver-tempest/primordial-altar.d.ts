import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
export declare class PrimordialAltar extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    set2: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State;
}
