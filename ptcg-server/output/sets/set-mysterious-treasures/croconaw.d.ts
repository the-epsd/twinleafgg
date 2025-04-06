import { PokemonCard, Stage, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Croconaw extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: import("../../game").CardType.WATER;
    hp: number;
    weakness: {
        type: import("../../game").CardType.LIGHTNING;
        value: number;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.WATER | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly HOVER_OVER_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
