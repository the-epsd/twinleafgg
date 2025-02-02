import { PokemonCard, Stage, CardType, CardTag, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ZeraoraVSTAR extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: never[];
    regulationMark: string;
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
