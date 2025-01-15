import { PokemonCard, CardTag, Stage, CardType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Dudunsparceex extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        damageCalculation: string;
        text: string;
        shredAttack?: undefined;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        shredAttack: boolean;
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
