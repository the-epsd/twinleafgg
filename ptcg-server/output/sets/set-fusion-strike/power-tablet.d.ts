import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class PowerTablet extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    tags: CardTag[];
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    text: string;
    readonly POWER_TABLET_MARKER = "POWER_TABLET_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
