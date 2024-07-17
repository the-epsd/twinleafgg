import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class DeoxysVSTAR extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    evolvesFrom: string;
    hp: number;
    tags: CardTag[];
    weakness: {
        type: CardType;
    }[];
    resistance: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        damageCalculation: string;
        text: string;
    })[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
