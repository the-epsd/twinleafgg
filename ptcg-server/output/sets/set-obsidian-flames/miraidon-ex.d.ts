import { PokemonCard, Stage, CardType, CardTag, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Miraidonex extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: never[];
    tags: CardTag[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    set: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
