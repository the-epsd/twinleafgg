import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
export declare class Aggron extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    regulationMark: string;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    resistance: {
        type: CardType;
        value: number;
    }[];
    hp: number;
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
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = "DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER";
    readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = "CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
