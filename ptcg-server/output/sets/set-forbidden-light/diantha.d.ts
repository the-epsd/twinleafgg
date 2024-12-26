import { StoreLike, State } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Diantha extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    readonly DIANTHA_MARKER = "DIANTHA_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
