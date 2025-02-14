import { CardType, Stage } from '../../game/store/card/card-types';
import { Attack, PokemonCard, Power, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Goldeen extends PokemonCard {
    stage: Stage;
    regulationMark: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    retreat: CardType.COLORLESS[];
    powers: Power[];
    attacks: Attack[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
