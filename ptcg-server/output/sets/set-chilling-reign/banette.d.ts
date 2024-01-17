import { PokemonCard, Stage, CardTag, CardType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Banette extends PokemonCard {
    stage: Stage;
    regulationMark: string;
    tags: CardTag[];
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
