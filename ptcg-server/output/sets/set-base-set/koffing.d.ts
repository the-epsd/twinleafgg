import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Koffing extends PokemonCard {
    name: string;
    cardImage: string;
    setNumber: string;
    set: string;
    fullName: string;
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
