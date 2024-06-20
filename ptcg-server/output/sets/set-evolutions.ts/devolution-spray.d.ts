import { TrainerCard } from '../../game';
import { CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class DevolutionSpray extends TrainerCard {
    name: string;
    setNumber: string;
    set: string;
    fullName: string;
    superType: SuperType;
    trainerType: TrainerType;
    cardType: CardType;
    hp: number;
    retreat: never[];
    attacks: never[];
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
