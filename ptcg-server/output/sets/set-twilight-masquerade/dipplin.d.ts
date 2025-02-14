import { CardType, Stage } from '../../game/store/card/card-types';
import { Attack, PokemonCard, Power, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Dipplin extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: Power[];
    attacks: Attack[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
