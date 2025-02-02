import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, PowerType } from '../../game';
export declare class Cramorant extends PokemonCard {
    stage: Stage;
    regulationMark: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
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
    getColorlessReduction(state: State): number;
    getWaterReduction(state: State): number;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
