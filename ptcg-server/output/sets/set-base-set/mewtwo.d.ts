import { StoreLike, State } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack, Power } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
export declare class Mewtwo extends PokemonCard {
    set: string;
    name: string;
    fullName: string;
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: Attack[];
    powers: Power[];
    readonly CLEAR_BARRIER_MARKER = "CLEAR_BARRIER_MARKER";
    readonly BARRIER_MARKER = "BARRIER_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
