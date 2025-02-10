import { TrainerCard, TrainerType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class EthansAdventure extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    cardImage: string;
    set: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
