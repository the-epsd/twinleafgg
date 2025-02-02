import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
export declare class TapuLeleGX extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        damageCalculation: string;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType[];
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
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
