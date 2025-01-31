import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Absol extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    attacks: {
        name: string;
        cost: (CardType.DARK | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    weakness: {
        type: CardType.GRASS;
    }[];
    retreat: CardType.COLORLESS[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
