import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Copperajah extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
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
        damage: number;
        cost: CardType[];
        text: string;
    }[];
    regulationMark: string;
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
