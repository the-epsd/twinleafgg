import { TrainerCard, TrainerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class PicnicBasket extends TrainerCard {
    regulationMark: string;
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
