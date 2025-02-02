import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Haunter extends PokemonCard {
    name: string;
    set: string;
    fullName: string;
    stage: Stage;
    evolvesFrom: string;
    cardImage: string;
    setNumber: string;
    cardType: CardType;
    hp: number;
    resistance: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType[];
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
