import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Buizel extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    weakness: {
        type: CardType;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    name: string;
    setNumber: string;
    fullName: string;
    cardImage: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
