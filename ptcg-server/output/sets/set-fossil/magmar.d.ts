import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Magmar extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.WATER;
    }[];
    resistance: never[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.FIRE[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = "DEFENDING_POKEMON_CANNOT_ATTACK_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
