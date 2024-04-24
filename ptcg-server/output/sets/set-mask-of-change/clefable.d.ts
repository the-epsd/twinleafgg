import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Clefable extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    regulationMark: string;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    hp: number;
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
