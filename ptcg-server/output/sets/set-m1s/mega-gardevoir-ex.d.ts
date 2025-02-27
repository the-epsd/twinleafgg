import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class MegaGardevoirex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.DARK;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        damageCalculation: string;
        text: string;
    })[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly MEGA_BRAVE_MARKER = "MEGA_BRAVE_MARKER";
    readonly CLEAR_MEGA_BRAVE_MARKER = "CLEAR_MEGA_BRAVE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
