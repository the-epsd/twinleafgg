import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Eternatus extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: never[];
    resistance: never[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.DARK[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: (CardType.FIRE | CardType.DARK)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
