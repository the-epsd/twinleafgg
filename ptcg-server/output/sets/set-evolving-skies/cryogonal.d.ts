import { PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Cryogonal extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.WATER;
    hp: number;
    weakness: {
        type: import("../../game").CardType.METAL;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.WATER | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
