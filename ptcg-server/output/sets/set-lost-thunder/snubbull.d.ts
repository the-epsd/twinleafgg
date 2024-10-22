import { PokemonCard, Stage, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Snubbull extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.FAIRY;
    hp: number;
    weakness: {
        type: import("../../game").CardType.METAL;
    }[];
    resistance: {
        type: import("../../game").CardType.DARK;
        value: number;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.FAIRY[];
        damage: number;
        damageCalculation: string;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
