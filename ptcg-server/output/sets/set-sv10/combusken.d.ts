import { PokemonCard, Stage, CardType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Combusken extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.WATER;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.FIRE[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: (CardType.FIRE | CardType.COLORLESS)[];
        damage: number;
        damageCalculation: string;
        text: string;
    })[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
