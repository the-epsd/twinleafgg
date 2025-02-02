import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Laprasex extends PokemonCard {
    cardType: CardType;
    tags: CardTag[];
    hp: number;
    stage: Stage;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
