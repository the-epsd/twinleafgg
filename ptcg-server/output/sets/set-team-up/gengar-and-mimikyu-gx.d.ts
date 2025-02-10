import { PokemonCard, Stage, CardType, CardTag, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class GengarMimikyuGX extends PokemonCard {
    stage: Stage;
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
        damageCalculation: string;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        gxAttack: boolean;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly CANNOT_PLAY_CARDS_FROM_HAND_MARKER = "CANT_PLAY_CARDS_FROM_HAND_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
