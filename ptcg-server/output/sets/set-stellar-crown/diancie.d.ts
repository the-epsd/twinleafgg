import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Diancie extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.GRASS;
    }[];
    resistance: never[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: (CardType.FIGHTING | CardType.COLORLESS)[];
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
