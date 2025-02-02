import { State, StoreLike, TrainerCard, TrainerType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class YellHorn extends TrainerCard {
    name: string;
    trainerType: TrainerType;
    fullName: string;
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
