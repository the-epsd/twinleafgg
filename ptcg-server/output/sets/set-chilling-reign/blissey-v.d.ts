import { PokemonCard, Stage, CardType, CardTag, State, StoreLike, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class BlisseyV extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
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
        damageCalculation: string;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    usedBlissfulBlast: boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
