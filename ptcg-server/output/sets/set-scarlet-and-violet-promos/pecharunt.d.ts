import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Pecharunt extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    weakness: {
        type: CardType;
    }[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = "DEFENDING_POKEMON_CANNOT_RETREAT_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
