import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerType } from '../../game';
export declare class Grant extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    powers: {
        name: string;
        useFromDiscard: boolean;
        powerType: PowerType;
        text: string;
    }[];
    private readonly GRANT_MARKER;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
