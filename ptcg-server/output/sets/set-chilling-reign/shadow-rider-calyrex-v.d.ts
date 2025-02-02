import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ShadowRiderCalyrexV extends PokemonCard {
    stage: Stage;
    regulationMark: string;
    cardType: CardType;
    tags: CardTag[];
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
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly SHADOW_MIST_MARKER = "SHADOW_MIST_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
