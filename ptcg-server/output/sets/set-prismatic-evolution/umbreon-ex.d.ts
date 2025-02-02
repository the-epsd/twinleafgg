import { PokemonCard, CardTag, Stage, CardType, Attack, State, StoreLike, CardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Umbreonex extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    weakness: {
        type: CardType.GRASS;
    }[];
    attacks: Attack[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    shuffleFaceDownPrizeCards(array: CardList[]): CardList[];
}
