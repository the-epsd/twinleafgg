import { PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MrMime extends PokemonCard {
    cardType: import("../../game").CardType.PSYCHIC;
    hp: number;
    stage: Stage;
    weakness: {
        type: import("../../game").CardType.DARK;
    }[];
    resistance: {
        type: import("../../game").CardType.FIGHTING;
        value: number;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.PSYCHIC | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly TRICKY_SLAP_MARKER = "TRICKY_SLAP_MARKER";
    readonly CLEAR_TRICKY_SLAP_MARKER = "CLEAR_TRICKY_SLAP_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
