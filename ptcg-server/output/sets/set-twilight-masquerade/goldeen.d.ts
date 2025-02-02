import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Goldeen extends PokemonCard {
    stage: Stage;
    regulationMark: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    retreat: CardType.COLORLESS[];
    canAttackTwice: boolean;
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType.COLORLESS[];
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
