import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { Player } from '../../game';
export declare class PokemonCatcher extends TrainerCard {
    regulationMark: string;
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    canPlay(store: StoreLike, state: State, player: Player): boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
