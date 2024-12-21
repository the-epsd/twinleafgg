import { TrainerCard } from '../../game';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class ScoopUpNet extends TrainerCard {
    name: string;
    cardImage: string;
    setNumber: string;
    set: string;
    fullName: string;
    superType: SuperType;
    trainerType: TrainerType;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
