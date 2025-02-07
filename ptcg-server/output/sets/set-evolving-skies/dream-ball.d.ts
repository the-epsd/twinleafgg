import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class DreamBall extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    private handlePrizeEffect;
}
