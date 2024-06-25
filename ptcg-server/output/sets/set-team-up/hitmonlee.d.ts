import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Hitmonlee extends PokemonCard {
    name: string;
    set: string;
    fullName: string;
    stage: Stage;
    cardImage: string;
    setNumber: string;
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    hitAndRunTurn: number;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
