import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Regice extends PokemonCard {
    cardType: CardType;
    stage: Stage;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    resistance: never[];
    retreat: CardType[];
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
    readonly IRON_BREAKER_MARKER = "IRON_BREAKER_MAREKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
