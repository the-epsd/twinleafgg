import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Abra extends PokemonCard {
    name: string;
    cardImage: string;
    set: string;
    fullName: string;
    cardType: CardType;
    setNumber: string;
    stage: Stage;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: never[];
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
