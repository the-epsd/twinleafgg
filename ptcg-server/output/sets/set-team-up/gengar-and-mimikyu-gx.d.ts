import { PokemonCard, Stage, CardType, CardTag, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class GengarMimikyuGX extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    resistance: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType[];
    tags: CardTag[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        gxAttack: boolean;
        text: string;
    })[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly CANNOT_PLAY_CARDS_FROM_HAND_MARKER = "CANT_PLAY_CARDS_FROM_HAND_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
