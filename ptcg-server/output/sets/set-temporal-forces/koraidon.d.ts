import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CardTag } from '../../game/store/card/card-types';
export declare class Koraidon extends PokemonCard {
    tags: CardTag[];
    regulationMark: string;
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        damageCalculator: string;
        text: string;
        shredAttack?: undefined;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        shredAttack: boolean;
        text: string;
        damageCalculator?: undefined;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
