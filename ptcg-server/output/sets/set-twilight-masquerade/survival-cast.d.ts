import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class SurvivalCast extends TrainerCard {
    regulationMark: string;
    trainerType: TrainerType;
    tags: CardTag[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    private canDiscard;
    text: string;
    reduceEffect(store: any, state: State, effect: Effect): State;
}
