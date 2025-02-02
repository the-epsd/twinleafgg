import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Flygonex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    regulationMark: string;
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
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    stormBug: boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
