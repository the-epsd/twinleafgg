import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
export declare class Noivernex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    regulationMark: string;
    cardType: CardType;
    hp: number;
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
    readonly PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string;
    readonly CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string;
    readonly DOMINATING_ECHO_MARKER = "DOMINATING_ECHO_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
