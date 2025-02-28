import { PokemonCard, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Onix extends PokemonCard {
    cardType: import("../../game").CardType.FIGHTING;
    hp: number;
    weakness: {
        type: import("../../game").CardType.GRASS;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
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
