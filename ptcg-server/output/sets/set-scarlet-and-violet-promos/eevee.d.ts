import { State, PowerType, CardType, PokemonCard, Stage, StoreLike } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class Eevee extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: {
        name: string;
        text: string;
        powerType: PowerType;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly EVOLUTIONARY_ADVANTAGE_MARKER = "EVOLUTIONARY_ADVANTAGE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
