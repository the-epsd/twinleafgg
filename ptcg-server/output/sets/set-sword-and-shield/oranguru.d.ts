import { PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Oranguru extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    weakness: {
        type: CardType;
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
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly PRIMATE_WISDOM_MARKER = "PRIMATE_WISDOM_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
