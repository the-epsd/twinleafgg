import { TrainerCard, TrainerType, CardTag, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class NsPPUp extends TrainerCard {
    trainerType: TrainerType;
    tags: CardTag[];
    regulationMark: string;
    set: string;
    name: string;
    cardImage: string;
    setNumber: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
