import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Goldeen extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreate: CardType[];
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
    readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = "PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER";
    readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = "CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
