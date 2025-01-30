import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class TogepiCleffaIgglybuffGX extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    resistance: {
        type: CardType.DARK;
        value: number;
    }[];
    retreat: CardType[];
    attacks: ({
        name: string;
        cost: (CardType.COLORLESS | CardType.FAIRY)[];
        damage: number;
        damageCalculation: string;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType.FAIRY[];
        damage: number;
        gxAttack: boolean;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly SUPREME_PUFF_MARKER = "SUPREME_PUFF_MARKER";
    readonly SUPREME_PUFF_MARKER_2 = "SUPREME_PUFF_MARKER_2";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
