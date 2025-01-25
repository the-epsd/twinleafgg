import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class Scizorex extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.GRASS;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: CardType.METAL[];
        damage: number;
        damageCalculation: string;
        text: string;
    })[];
    readonly STEEL_WING = "STEEL_WING";
    readonly CLEAR_STEEL_WING = "CLEAR_STEEL_WING";
    set: string;
    name: string;
    fullName: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
