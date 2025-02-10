import { CardType, PokemonCard, PowerType, Stage, State, StoreLike } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class Crobat extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: never[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.DARK | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly SHADOWY_ENVOY_MARKER = "SHADOWY_ENVOY_MARKER";
    readonly PLAY_JANINES_SECRET_ART_MARKER = "PLAY_JANINES_SECRET_ART_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
