import { Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Sandshrew extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.FIGHTING;
    hp: number;
    weakness: {
        type: import("../../game").CardType.GRASS;
    }[];
    resistance: {
        type: import("../../game").CardType.LIGHTNING;
        value: number;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: Attack[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
