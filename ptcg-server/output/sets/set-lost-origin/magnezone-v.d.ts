import { PokemonCard, Stage, CardType, CardTag, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MagnezoneV extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    tags: CardTag[];
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
}
