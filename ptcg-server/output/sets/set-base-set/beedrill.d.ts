import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Beedrill extends PokemonCard {
    set: string;
    name: string;
    fullName: string;
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    resistances: {
        type: CardType;
        value: number;
    }[];
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
