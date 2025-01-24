import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class YveltalGX extends PokemonCard {
    tags: CardTag[];
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
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
