import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class SkeledirgeEX extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    weakness: {
        type: CardType;
    }[];
    resistance: {
        type: CardType;
        value: number;
    }[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
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
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly CONCEALED_CARDS_MARKER = "CONCEALED_CARDS_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
