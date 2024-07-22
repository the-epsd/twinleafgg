import { PokemonCard, Stage, CardType, StoreLike, State, CardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Slowbro extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
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
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    shuffleFaceDownPrizeCards(array: CardList[]): CardList[];
}
