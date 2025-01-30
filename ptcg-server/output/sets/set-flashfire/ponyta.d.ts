import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class Ponyta extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.WATER;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.FIRE[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = "PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER";
    readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = "CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
