import { PokemonCard, Stage, CardType, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Pyukumuku extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: {
        name: string;
        useFromHand: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly PYUK_MARKER = "PYUK_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
