import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Dragonair extends PokemonCard {
    set: string;
    name: string;
    fullName: string;
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    cardImage: string;
    setNumber: string;
    resistance: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType[];
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
