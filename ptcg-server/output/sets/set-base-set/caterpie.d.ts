import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Caterpie extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.GRASS;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIRE;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.GRASS[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
