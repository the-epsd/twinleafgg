import { PokemonCard, Stage, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class EthansTyphlosion extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: import("../../game").CardType.FIRE;
    hp: number;
    weakness: {
        type: import("../../game").CardType.WATER;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: import("../../game").CardType.FIRE[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: (import("../../game").CardType.FIRE | import("../../game").CardType.COLORLESS)[];
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
