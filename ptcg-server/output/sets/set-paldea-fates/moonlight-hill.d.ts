import { StoreLike, State, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
export declare class MoonlightHill extends TrainerCard {
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
