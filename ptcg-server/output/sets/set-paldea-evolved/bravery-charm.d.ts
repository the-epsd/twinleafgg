import { TrainerCard, TrainerType, State, StoreLike } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class BraveryCharm extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    private readonly HP_BONUS;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
