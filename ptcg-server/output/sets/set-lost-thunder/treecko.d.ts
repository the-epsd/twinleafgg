import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Treecko extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    evolvesInto: string;
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    setNumber: string;
    set: string;
    fullName: string;
    cardImage: string;
    name: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
