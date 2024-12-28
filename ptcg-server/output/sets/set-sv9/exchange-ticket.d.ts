import { State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ExchangeTicket extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    name: string;
    cardImage: string;
    setNumber: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    private shuffleArray;
}
