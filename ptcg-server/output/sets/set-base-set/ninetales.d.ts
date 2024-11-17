import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack, Power } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Ninetales extends PokemonCard {
    set: string;
    name: string;
    evolvesFrom: string;
    fullName: string;
    stage: Stage;
    cardType: CardType;
    cardImage: string;
    setNumber: string;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: Power[];
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
