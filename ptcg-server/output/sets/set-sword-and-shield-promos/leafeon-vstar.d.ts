import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class LeafeonVSTAR extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    tags: CardTag[];
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
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
    regulationMark: string;
    set: string;
    set2: string;
    setNumber: string;
    name: string;
    fullName: string;
    LEAF_GUARD_MARKER: string;
    CLEAR_LEAF_GUARD_MARKER: string;
    readonly VSTAR_MARKER = "VSTAR_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
