import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State } from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
export declare class Victreebel extends PokemonCard {
    readonly TIME_CIRCLE_MARKER: string;
    readonly CLEAR_TIME_CIRCLE_MARKER: string;
    stage: Stage;
    evolvesFrom: string;
    regulationMark: string;
    cardType: CardType;
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
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
