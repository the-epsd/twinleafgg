import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag, Format } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class ComputerSearch extends TrainerCard {
    trainerType: TrainerType;
    tags: CardTag[];
    format: Format;
    set: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
