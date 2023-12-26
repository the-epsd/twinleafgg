import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Mawile extends PokemonCard {
    stage: Stage;
    regulationMark: string;
    cardType: CardType;
    hp: number;
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
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly TEMPTING_TRAP_MARKER = "TEMPTING_TRAP_MARKER";
    readonly CLEAR_TEMPTING_TRAP_MARKER = "CLEAR_TEMPTING_TRAP_MARKER";
    readonly RETREAT_MARKER = "RETREAT_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
