import { PokemonCard, Stage, CardType, State, StoreLike, PowerType, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class SilvallyGX extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        damageCalculation: string;
        text: string;
        gxAttack: boolean;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
