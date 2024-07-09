import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class HisuianZoroarkV extends PokemonCard {
    stage: Stage;
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
    voidReturn: boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
