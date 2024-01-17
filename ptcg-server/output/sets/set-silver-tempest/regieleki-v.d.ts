import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class RegielekiV extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly LEAF_GUARD_MARKER = "LEAF_GUARD_MARKER";
    readonly CLEAR_LEAF_GUARD_MARKER = "CLEAR_LEAF_GUARD_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
