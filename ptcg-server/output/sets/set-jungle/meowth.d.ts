import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Meowth extends PokemonCard {
    name: string;
    cardImage: string;
    set: string;
    setNumber: string;
    fullName: string;
    cardType: import("../../game").CardType.COLORLESS;
    stage: Stage;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIGHTING;
    }[];
    resistance: {
        type: import("../../game").CardType.PSYCHIC;
        value: number;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
