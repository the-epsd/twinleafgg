import { StoreLike, State } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
export declare class Mewtwo extends PokemonCard {
    stage: Stage;
    cardType: CardType.PSYCHIC;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: Attack[];
    set: string;
    name: string;
    fullName: string;
    setNumber: string;
    cardImage: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
