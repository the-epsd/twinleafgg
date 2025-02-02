import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Garbodor extends PokemonCard {
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
        cost: CardType.DARK[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: (CardType.DARK | CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
