import { PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Meowth extends PokemonCard {
    cardType: import("../../game").CardType.DARK;
    additionalCardTypes: import("../../game").CardType.METAL[];
    stage: Stage;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIGHTING;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: import("../../game").CardType.DARK[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: (import("../../game").CardType.METAL | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
